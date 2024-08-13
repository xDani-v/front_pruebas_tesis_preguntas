import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css'
})
export class RecuperarComponent {

  constructor(private datosService: DatosService, private route: Router) { }

  cedula: string = '';

  enviar() {
    this.datosService.recuperar(this.cedula).subscribe(
      res => {
        alert(res.message);
        this.route.navigate(['/']);
      },
      err => {
        console.log(err);
      }
    );
  }
}
