import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  constructor(private datosService: DatosService) { }

  usuarios: any[] = [];
  user: any = {};
  pruebas: any[] = [];
  usuario_prueba: number = -1;

  isModalOpen = false;
  isModal2Open = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.user = {};
  }

  openModal2(id: number) {
    this.isModal2Open = true;
    this.usuario_prueba = id;
    this.cargarPruebasUsr();
  }

  closeModal2() {
    this.isModal2Open = false;
    this.pruebas = [];
  }


  ngOnInit() {
    this.listar();
  }

  listar() {
    this.datosService.getUsuarios().subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  registrarUsuario() {

    if (this.user.id) {
      this.datosService.updateUsuario(this.user).subscribe(
        response => {
          this.listar();
        },
        error => {
          console.error('Error al actualizar usuario:', error);
        }
      );

    } else {
      this.datosService.registerUser(this.user).subscribe(
        response => {
          this.listar();
        },
        error => {
          console.error('Error al registrar usuario:', error);

        }
      );
    }

    this.closeModal();
    this.user = {};

  }

  cargarPruebasUsr() {
    this.datosService.getPruebasByUsuarioId(this.usuario_prueba).subscribe((data: any) => {
      this.pruebas = data;
    });
  }

  cargar(user: any) {
    this.openModal();
    this.datosService.getUserById(user.id).subscribe((data: any) => {
      this.user = data;
    });
    console.log(user);
  }

  eliminarPrueba(id: number) {
    this.datosService.deleteProgreso(id).subscribe(
      response => {
        this.cargarPruebasUsr();
      },
      error => {
        console.error('Error al borrar progreso:', error);
      }
    );
  }

  getPruebaNombre(prueba_id: number): string {
    switch (prueba_id) {
      case 1:
        return 'Test Rápido';
      case 2:
        return 'Test Interés Aptitud';
      case 3:
        return 'Personalidad';
      default:
        return 'Desconocido';
    }
  }

  generateCertificateForStudent(nombre: string) {
    const certificateContent = `
     
      <img src="assets/certificado.png" alt="Certificado" style="width: 100%; height: 100%;">
      <h2 style="position: absolute; top: 185%; left: 39%; font-size:54px;" >${nombre.toUpperCase()}</h2>
   
  `;

    const div = document.createElement('div');
    div.innerHTML = certificateContent;
    document.body.appendChild(div);

    html2canvas(div).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297);
      doc.save(`${nombre}_certificado.pdf`);
      document.body.removeChild(div);
    });
  }

  //inico
  generarPDF(id: number) {
    this.datosService.getUserById(id).subscribe(userRes => {
      if (userRes) {
        this.datosService.getPruebasByUsuarioId(id).subscribe(pruebasRes => {
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
  //fin
}
