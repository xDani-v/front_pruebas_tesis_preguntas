import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private api_user = 'http://localhost:3000/api/user';
  private api_prueba_tr = 'http://localhost:3000/api/progresoPrueba';
  private api_preguntas = 'http://localhost:3000/api/preguntas';
  private api_pruebas = 'http://localhost:3000/api/pruebas';
  private api_red = 'http://localhost:3000/api/red';

  constructor(private http: HttpClient) { }

  recuperarEmail(cedula: string): Observable<any> {
    return this.http.post(`${this.api_user}/recuperar`, { cedula });
  }

  loginUser(username: string, password: string): Observable<any> {
    return this.http.post(`${this.api_user}/login`, { username, password });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.api_user}/registrar`, user);
  }

  verificarPrueba(usuario_id: number, prueba_id: number): Observable<any> {
    return this.http.post(`${this.api_prueba_tr}/verificar`, { usuario_id, prueba_id });
  }

  preguntas_byprueba(prueba_id: number): Observable<any> {
    return this.http.get(`${this.api_preguntas}/+${prueba_id}`);
  }

  createProgreso(progresoData: any): Observable<any> {
    return this.http.post(this.api_prueba_tr, progresoData);
  }

  updateProgreso(progresoData: any): Observable<any> {
    return this.http.post(`${this.api_prueba_tr}/acc`, progresoData);
  }
  //administrador
  getUsuarios(): Observable<any> {
    return this.http.get(this.api_user);
  }

  getPruebas(): Observable<any> {
    return this.http.get(this.api_pruebas);
  }

  updateUsuario(user: any): Observable<any> {
    return this.http.put(`${this.api_user}`, user);
  }

  getUserById(id: number): Observable<any> {
    const body = { id }; // Crear un objeto con el ID
    return this.http.post(`${this.api_user}/id`, body); // Enviar el objeto en el cuerpo de la solicitud
  }

  getPruebasByUsuarioId(usuario_id: number): Observable<any> {
    return this.http.get(`${this.api_prueba_tr}/prueba/${usuario_id}`);
  }

  deleteProgreso(id: number): Observable<any> {
    return this.http.delete(`${this.api_prueba_tr}/${id}`);
  }

  createPrueba(prueba: any): Observable<any> {
    return this.http.post<any>(this.api_pruebas, prueba);
  }

  // Método para actualizar una prueba existente
  updatePrueba(prueba: any): Observable<any> {
    const url = `${this.api_pruebas}/${prueba.id}`;
    return this.http.put<any>(url, prueba);
  }

  predecirArea(respuestasUsuario: any): Observable<any> {
    return this.http.post<any>(this.api_red, respuestasUsuario);
  }

  predecirFn(respuestasUsuario: any): Observable<any> {
    return this.http.post<any>(this.api_red + "/final", respuestasUsuario);
  }

  verificarRespuesta(id: string): Observable<{ tieneRespuesta: boolean }> {
    return this.http.post<{ tieneRespuesta: boolean }>(`${this.api_user}/res/${id}`, {});
  }

  actualizarRespuesta(id: string, area: string, motivo: string): Observable<any> {
    const body = { id, area, motivo };
    return this.http.post<any>(`${this.api_user}/act`, body);
  }

  enviarCodigo(email: any): Observable<any> {
    return this.http.post<any>(this.api_red + '/confirmacion', { email });
  }

  verificarCodigo(codigo: any): Observable<any> {
    return this.http.post<any>(this.api_red + '/verificar', { codigo });
  }

  recuperar(cedula: any): Observable<any> {
    return this.http.post<any>(this.api_red + '/recuperacion', { cedula });
  }

  //agregar y eliminar preguntas
  createPregunta(pregunta: { prueba_id: number, texto: string }): Observable<any> {
    return this.http.post<any>(`${this.api_preguntas}/crear`, pregunta);
  }
  deletePregunta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api_preguntas}/${id}`);
  }
}
