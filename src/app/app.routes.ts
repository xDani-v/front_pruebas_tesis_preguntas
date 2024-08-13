import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PruebasComponent } from './components/pruebas/pruebas.component';

export const routes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'registrar', component: RegistrarComponent },
    { path: 'recuperar', component: RecuperarComponent },
    { path: 'preguntas/:id', component: PreguntasComponent },
    {
        path: 'admin', component: AdministradorComponent,
        children: [
            { path: 'usuarios', component: UsuariosComponent },
            { path: 'pruebas', component: PruebasComponent }
        ]
    }

];
