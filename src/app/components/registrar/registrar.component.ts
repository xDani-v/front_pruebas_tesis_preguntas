import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {

  user: any = {};
  codigo: string = "";
  cedulaValida: boolean = true;

  constructor(private datosService: DatosService) { }

  validarCedula() {
    const cedulaRegex = /^[0-9]{10}$/; // Ejemplo de regex para cédula de 10 dígitos
    this.cedulaValida = cedulaRegex.test(this.user.cedula);
  }

  registrarUsuario() {

    this.validarCedula();

    if (!this.cedulaValida) {
      alert('Cédula no válida. Debe tener 10 dígitos numéricos.');
      return;
    }

    if (this.codigo == "") {
      alert('Codigo de verificacion no ingresado');
    }



    this.datosService.verificarCodigo(this.codigo).subscribe(
      response => {
        if (response.message === "Código válido") {


          this.datosService.registerUser(this.user).subscribe(
            response => {

              this.user = {};
              this.codigo = "";
              alert('Usuario registrado correctamente');
            },
            error => {
              console.error('Error al registrar usuario:', error);
              // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
            }
          );

        } else {
          alert('Código no válido:' + response);
          // Aquí puedes manejar el caso de código no válido, como mostrar un mensaje de error al usuario
        }
      },
      error => {
        alert('Error al verificar código');
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }

  enviarCorreo() {
    if (!this.user.correo) {
      alert('Correo no ingresado');
      return;
    }
    this.datosService.enviarCodigo(this.user.correo).subscribe(
      response => {
        alert('Codigo enviar al correo enviado');
      },
      error => {
        console.error('Error al enviar correo:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      });
  }

}
