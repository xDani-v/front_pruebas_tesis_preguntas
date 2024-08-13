import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.css'
})
export class PruebasComponent {
  pruebas: any[] = [];
  prueba_actual: any = {};
  preguntas: any[] = [];
  p: number = 1;
  pregunta_texto: string = '';


  constructor(private datosService: DatosService) { }

  isModalOpen = false;
  isModal2Open = false;
  prueba: any = {};


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.prueba = {};
  }


  openModal2(id: number) {
    this.isModal2Open = true;
    this.prueba_actual = id;
    console.log(this.prueba_actual);
    this.cargarPreguntas();
  }

  closeModal2() {
    this.isModal2Open = false;
    this.preguntas = [];
  }



  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.datosService.getPruebas().subscribe(response => {
      this.pruebas = response;
    }, error => {
      console.error('Error al obtener las pruebas:', error);
    });
  }

  cargarPreguntas() {
    this.datosService.preguntas_byprueba(this.prueba_actual).subscribe(response => {
      this.preguntas = response;
    }, error => {
      console.error('Error al obtener las preguntas:', error);
    });
  }

  cargarDatos(prueba: any) {
    this.prueba = prueba;
    this.openModal();
  }

  registrarPrueba() {

    if (this.prueba.id) {

      this.datosService.updatePrueba(this.prueba).subscribe(response => {
        this.cargar();
        this.closeModal();
      }, error => {
        console.error('Error al actualizar la prueba:', error);
      });

    }
    else {
      this.datosService.createPrueba(this.prueba).subscribe(response => {
        this.cargar();
        this.closeModal();
      }, error => {
        console.error('Error al registrar la prueba:', error);
      });
    }
  }

  crearPregunta(): void {
    let prueba_id = this.prueba_actual;
    let texto = this.pregunta_texto;
    const pregunta: any = { prueba_id, texto };
    this.datosService.createPregunta(pregunta).subscribe(response => {
      this.cargarPreguntas();
      this.pregunta_texto = '';
    }, error => {
      console.error('Error al crear la pregunta:', error);
    });
  }

  eliminarPregunta(id: number): void {
    this.datosService.deletePregunta(id).subscribe(response => {
      this.cargarPreguntas();
    }, error => {
      console.error('Error al eliminar la pregunta:', error);
    });
  }


}
