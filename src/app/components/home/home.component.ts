import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private datosService: DatosService, private router: Router) { }

  user: any = {};
  resultados: any[] = [];
  respuesta_final: string = '';
  mostrarResultado: boolean = false;
  mostrarResultado2: boolean = false;
  mostrarResultado3: boolean = false;

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleResultado() {
    this.mostrarResultado = !this.mostrarResultado;
  }

  toggleResultado2() {
    this.mostrarResultado2 = !this.mostrarResultado2;
  }

  toggleResultado3() {
    this.mostrarResultado3 = !this.mostrarResultado3;
  }
  registrarUsuario() {

    if (this.user.id) {
      this.datosService.updateUsuario(this.user).subscribe(
        response => {
        },
        error => {
          console.error('Error al actualizar usuario:', error);
        }
      );

    }
  }

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.datosService.getUserById(this.user.id).subscribe(
        res => {
          if (res) {
            this.user = res;
          }
        },
        err => {
          console.error(err);
        });
    } else {
      console.error('No se encontraron datos de usuario en localStorage');
    }
    this.obtenerResultados();
    this.cargarRespuesta();

  }

  //obtener datos de los resultados
  obtenerResultados() {
    let usuario_id = this.user.id;
    this.datosService.getPruebasByUsuarioId(usuario_id).subscribe(
      res => {
        this.resultados = res;
      },
      err => {
        console.error(err);
      }
    );
  }

  getResultadoPorPrueba(prueba_id: number): string {
    const resultado = this.resultados.find(r => r.prueba_id === prueba_id);
    if (resultado && resultado.area && resultado.motivo) {
      return resultado.area + ": " + resultado.motivo;
    }
    return '';
  }

  verificarPrueba(pos: number) {
    let usuario_id = this.user.id;
    this.datosService.verificarPrueba(usuario_id, pos).subscribe(
      res => {
        console.log(res);
        if (res.iniciado === false) {
          // Caso 1: No hay fila, permitir iniciar una nueva prueba
          console.log('No hay prueba existente, puede iniciar una nueva prueba.');
          this.router.navigate(['/preguntas', pos], { queryParams: { nueva: true } });
        } else if (res.completado === "En proceso") {
          // Caso 2: Prueba en proceso, continuar con la prueba

          this.router.navigate(['/preguntas', pos], { queryParams: { nueva: false } });
        } else if (res.completado === "finalizado") {

          console.log('El usuario ya terminó la prueba.');

        }
      },
      err => {
        console.error(err);
      }
    );
  }

  async obtenerResultadoFinal() {
    let usuario_id = this.user.id;

    // Verificar la respuesta y obtener el resultado como un objeto
    const respuestaVerificada: any = await this.datosService.verificarRespuesta(usuario_id).toPromise();


    // Ajustar la verificación del booleano
    if (respuestaVerificada.tieneRespuesta) { // Utiliza la propiedad correcta de respuestaVerificada
      alert('Contacte al administrador para una nueva respuesta');
      this.respuesta_final = this.user.area + ': ' + this.user.motivo;
    } else {
      const res: any[] = this.resultados.map(r => r.area + ':' + r.motivo);
      console.log(res);

      // Realizar la predicción
      this.datosService.predecirFn({ respuestasUsuario: res }).subscribe(
        res => {
          console.log(res);
          this.respuesta_final = res.carrera + ': ' + res.motivo;

          // Actualizar la respuesta en el servidor
          this.datosService.actualizarRespuesta(usuario_id, res.carrera, res.motivo).subscribe(
            () => {
              console.log('Respuesta actualizada');
            },
            err => {
              console.error('Error al actualizar la respuesta:', err);
            }
          );
        },
        err => {
          console.error('Error al predecir la respuesta:', err);
        }
      );
    }
  }

  generateCertificateForStudent() {

    let salida = this.user.nombre + ' ' + this.user.apellido;
    const certificateContent = `
     
      <img src="assets/certificado.png" alt="Certificado" style="width: 100%; height: 100%;">
      <h2 style="position: absolute; top: 234%; left: 39%; font-size:54px;" >${salida.toUpperCase()}</h2>
   
  `;

    const div = document.createElement('div');
    div.innerHTML = certificateContent;
    document.body.appendChild(div);

    html2canvas(div).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297);
      doc.save(`${salida}_certificado.pdf`);
      document.body.removeChild(div);
    });
  }

  cargarRespuesta() {
    this.datosService.getUserById(this.user.id).subscribe(
      res => {

        if (res.area === null) {
          this.respuesta_final = '';
        } else {
          this.respuesta_final = res.area + ': ' + res.motivo;;
        }
      },
      err => {
        console.error(err);
      });
  }

  // Método para obtener el nombre de la prueba basado en el ID
  getTestName(prueba_id: number): string {
    switch (prueba_id) {
      case 1:
        return 'Test Rápido';
      case 2:
        return 'Test de Interés y Aptitud';
      case 3:
        return 'Test de Personalidad';
      default:
        return 'Desconocido';
    }
  }

  //in
  generarPDF() {
    this.datosService.getUserById(this.user.id).subscribe(userRes => {
      if (userRes) {
        this.datosService.getPruebasByUsuarioId(this.user.id).subscribe(pruebasRes => {
          if (pruebasRes) {
            // Crear un contenedor para el contenido del PDF
            const container = document.createElement('div');
            container.style.width = '210mm'; // A4 width
            container.style.height = '297mm'; // A4 height
            container.style.padding = '20px';
            container.style.fontFamily = 'Arial, sans-serif';

            // Agregar título
            const title = document.createElement('h1');
            title.innerText = 'Test de Orientación Vocacional';
            title.style.textAlign = 'center';
            title.style.fontSize = '24px';
            title.style.marginBottom = '20px';
            container.appendChild(title);

            // Agregar datos del participante
            const participantInfo = document.createElement('div');
            participantInfo.innerHTML = `
                        <h2>Datos del Participante</h2>
                        <ul>
                            <li><strong>Cédula:</strong> ${userRes.cedula}</li>
                            <li><strong>Nombre:</strong> ${userRes.nombre} ${userRes.apellido}</li>
                            <li><strong>Teléfono:</strong> ${userRes.telefono}</li>
                            <li><strong>Correo:</strong> ${userRes.correo}</li>
                        </ul>
                    `;
            participantInfo.style.border = '1px solid #ddd';
            participantInfo.style.padding = '10px';
            participantInfo.style.marginBottom = '20px';
            container.appendChild(participantInfo);

            // Agregar resultados en formato tabla
            const resultsTable = document.createElement('table');
            resultsTable.style.width = '100%';
            resultsTable.style.borderCollapse = 'collapse';
            resultsTable.innerHTML = `
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Test</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Área</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha de Finalización</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pruebasRes.map((prueba: any) => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${this.getTestName(prueba.prueba_id)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${prueba.area.trim()}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${this.formatFechaHora(prueba.fecha_actualizacion)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    `;
            container.appendChild(resultsTable);

            // Agregar recomendación
            const recommendation = document.createElement('div');
            recommendation.innerHTML = `
                        <h2>Recomendación</h2>
                        <p><strong>Área:</strong> ${userRes.area}</p>
                        <p><strong>Motivo:</strong> ${userRes.motivo}</p>
                    `;
            recommendation.style.border = '1px solid #ddd';
            recommendation.style.padding = '10px';
            recommendation.style.marginBottom = '20px';
            container.appendChild(recommendation);

            // Línea de firma
            const signature = document.createElement('div');
            signature.innerHTML = `
                        
                         <div style="text-align: center;">
                        <img src="assets/firma.png" alt="Firma" style="width: 200px; height: auto;">
                        <p style="margin-top: 20px;">____________________________<br>Jeandry Mayon<br>Orientador Vocacional</p>
                    </div>
                    `;
            container.appendChild(signature);

            // Añadir el contenedor al body para capturarlo con html2canvas
            document.body.appendChild(container);

            // Usar html2canvas para capturar el contenido del contenedor
            html2canvas(container).then(canvas => {
              const imgData = canvas.toDataURL('image/png');
              const doc = new jsPDF('p', 'mm', 'a4');
              doc.addImage(imgData, 'PNG', 0, 0, 210, 297);
              doc.save(`${userRes.nombre}_reporte.pdf`);
              document.body.removeChild(container); // Limpiar el DOM
            });
          }
        });
      }
    });
  }

  formatFechaHora(fechaHora: string): string {
    const fecha = new Date(fechaHora);

    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    return `${fechaFormateada}, ${horaFormateada}`;
  }
  //fin
}
