import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = "";
  password: string = "";


  constructor(private datosService: DatosService, private route: Router) { }

  login() {
    this.datosService.loginUser(this.username, this.password).subscribe(
      response => {
        if (response.user && response.user.id) {
          console.log('Usuario logueado:', response);

          localStorage.setItem('user', JSON.stringify(response.user));
          if (response.user.cedula == "admin") {
            this.route.navigate(['/admin']);
          } else {
            this.route.navigate(['/home']);
          }
        } else {
          console.error('Respuesta inválida del servidor:', response);

        }
      },
      error => {
        console.error('Error al registrar usuario:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );

  }
}
