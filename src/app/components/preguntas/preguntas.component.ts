import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
interface Pregunta {
  texto: string;
  respuesta: string | null;
}
@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export class PreguntasComponent {

  preguntas: Pregunta[] = [];
  prueba_act: number = 0;
  opciones: { description: string; value: number }[] = [
    { description: "Participar en debates o actividades sociales.", value: 1 },
    { description: "Explorar la naturaleza o hacer actividades al aire libre.", value: 1 },
    { description: "Experimentar con nuevas tecnologías o dispositivos.", value: 1 },
    { description: "Sumergirte en proyectos artísticos como pintar o escribir.", value: 1 },
    { description: "Documentales sobre descubrimientos científicos o históricos.", value: 2 },
    { description: "Series o películas que exploren la complejidad de las relaciones humanas.", value: 2 },
    { description: "Contenido que despierte tu creatividad como tutoriales de arte o música.", value: 2 },
    { description: "Programas que te desafíen a pensar críticamente sobre temas sociales o políticos.", value: 2 },
    { description: "Investigaciones o proyectos que requieran análisis de datos.", value: 3 },
    { description: "Diseño y construcción de soluciones tecnológicas.", value: 3 },
    { description: "Expresión artística a través de la pintura, la música o la actuación.", value: 3 },
    { description: "Colaboración en proyectos comunitarios o actividades de voluntariado.", value: 3 },
    { description: "Libros que exploran los misterios de la ciencia o el universo.", value: 4 },
    { description: "Narrativas que te transportan a mundos imaginarios o futuristas.", value: 4 },
    { description: "Obras que te inspiran a expresar tu creatividad de manera única.", value: 4 },
    { description: "Textos que te invitan a reflexionar sobre la sociedad o el comportamiento humano.", value: 4 },
    { description: "Investigaciones científicas con potencial de impacto en la salud o el medio ambiente.", value: 5 },
    { description: "Desarrollo de aplicaciones o tecnologías innovadoras.", value: 5 },
    { description: "Producción de obras artísticas que inspiren y conecten con la audiencia.", value: 5 },
    { description: "Iniciativas sociales que aborden problemas comunitarios y promuevan el cambio positivo.", value: 5 },
    { description: "Participar en competencias académicas o científicas.", value: 6 },
    { description: "Desafiar tus habilidades técnicas con proyectos de ingeniería o programación.", value: 6 },
    { description: "Sumergirte en actividades creativas que te permitan expresar tu individualidad.", value: 6 },
    { description: "Contribuir al bienestar de los demás a través de actividades de servicio o cuidado social.", value: 6 },
    { description: "Resolución de problemas lógicos o matemáticos.", value: 7 },
    { description: "Troubleshooting y reparación de dispositivos electrónicos.", value: 7 },
    { description: "Interpretación y análisis de obras artísticas o musicales.", value: 7 },
    { description: "Abordaje de conflictos interpersonales y resolución de desafíos sociales.", value: 7 },
    { description: "Líder, asumiendo la responsabilidad y dirigiendo al equipo.", value: 8 },
    { description: "Colaborativo, contribuyendo con ideas y apoyando las decisiones grupales.", value: 8 },
    { description: "Independiente, prefiriendo trabajar en proyectos individuales.", value: 8 },
    { description: "Facilitador, ayudando a mantener la armonía y la comunicación dentro del grupo.", value: 8 },
    { description: "Análisis de datos y extracción de conclusiones significativas.", value: 9 },
    { description: "Desarrollo de soluciones tecnológicas innovadoras y eficientes.", value: 9 },
    { description: "Creación de obras visuales, musicales o literarias con impacto emocional.", value: 9 },
    { description: "Comunicación efectiva y construcción de relaciones interpersonales sólidas.", value: 9 },
    { description: "Estructurando y planificando meticulosamente cada paso.", value: 10 },
    { description: "Adaptándote y resolviendo problemas a medida que surgen.", value: 10 },
    { description: "Seguir tu intuición y permitir que la creatividad guíe el proceso.", value: 10 },
    { description: "Colaborando con otros y distribuyendo responsabilidades de manera equitativa.", value: 10 },
    { description: "Problemas complejos que requieren análisis profundo y soluciones innovadoras.", value: 11 },
    { description: "Proyectos tecnológicos que demandan dominio de herramientas y software especializados.", value: 11 },
    { description: "Retos creativos que te permiten explorar nuevas formas de expresión y comunicación.", value: 11 },
    { description: "Situaciones que requieren empatía y habilidades sociales para resolver conflictos y alcanzar acuerdos.", value: 11 },
    { description: "Comprensión profunda a través de la investigación y el estudio.", value: 12 },
    { description: "Práctica constante y experimentación para dominar nuevas habilidades.", value: 12 },
    { description: "Exploración creativa y libre de reglas preestablecidas.", value: 12 },
    { description: "Colaboración y discusión con otros para compartir conocimientos y perspectivas.", value: 12 },
    { description: "Extrovertido y sociable, disfruto interactuar con muchas personas.", value: 13 },
    { description: "Introvertido y reflexivo, prefiero conversaciones más profundas con unos pocos.", value: 13 },
    { description: "Equilibrado, me adapto a diferentes situaciones sociales según sea necesario.", value: 13 },
    { description: "Reservado y observador, prefiero estar en segundo plano y observar.", value: 13 },
    { description: "Abordo el problema con un enfoque lógico y paso a paso.", value: 14 },
    { description: "Exploro diferentes perspectivas y soluciones antes de tomar una decisión.", value: 14 },
    { description: "Sigo mi instinto y confío en mi intuición para encontrar una solución.", value: 14 },
    { description: "Busco el consejo de otros y colaboro para encontrar la mejor solución.", value: 14 },
    { description: "Realizando actividades al aire libre o practicando deportes.", value: 15 },
    { description: "Sumergido en un buen libro o disfrutando de la música.", value: 15 },
    { description: "Explorando nuevas tecnologías o aprendiendo habilidades nuevas.", value: 15 },
    { description: "Pasando tiempo con amigos o seres queridos.", value: 15 },
    { description: "Ambiente colaborativo y abierto, donde se valoren las ideas de todos.", value: 16 },
    { description: "Entorno estructurado y organizado, con claras expectativas y roles definidos.", value: 16 },
    { description: "Espacio creativo y flexible, que fomente la experimentación y la innovación.", value: 16 },
    { description: "Lugar tranquilo y relajado, que permita concentrarse sin distracciones.", value: 16 },
    { description: "Encarando los desafíos de manera metódica y organizada.", value: 17 },
    { description: "Afrontando los problemas con calma y pensamiento claro.", value: 17 },
    { description: "Buscando apoyo y orientación de amigos o familiares.", value: 17 },
    { description: "Tomando un descanso para recargar energías y ganar perspectiva.", value: 17 },
    { description: "El sentido de logro y la posibilidad de alcanzar metas personales.", value: 18 },
    { description: "El deseo de contribuir al bienestar de la comunidad o la sociedad.", value: 18 },
    { description: "La oportunidad de aprender y crecer en el proceso.", value: 18 },
    { description: "La conexión con otros y la posibilidad de construir relaciones significativas.", value: 18 },
    { description: "La familia y las relaciones personales.", value: 19 },
    { description: "El crecimiento personal y el desarrollo profesional.", value: 19 },
    { description: "El impacto positivo en la sociedad o el medio ambiente.", value: 19 },
    { description: "La búsqueda de conocimiento y la exploración del mundo.", value: 19 },
    { description: "El deseo de alcanzar mis metas y cumplir mis sueños.", value: 20 },
    { description: "El compromiso con el servicio y la ayuda a los demás.", value: 20 },
    { description: "La pasión por lo que hago y el disfrute del proceso.", value: 20 },
    { description: "El desafío de superarme a mí mismo y probar nuevas experiencias.", value: 20 },
    { description: "La honestidad y la integridad.", value: 21 },
    { description: "La empatía y la compasión.", value: 21 },
    { description: "La creatividad y la originalidad.", value: 21 },
    { description: "La perseverancia y la determinación.", value: 21 },
    { description: "Proyectos que aborden problemas sociales o ambientales importantes.", value: 22 },
    { description: "Actividades que fomenten la creatividad y la expresión personal.", value: 22 },
    { description: "Iniciativas que promuevan la igualdad y la justicia social.", value: 22 },
    { description: "Proyectos que impulsen la innovación y el progreso.", value: 22 },
    { description: "Abierto y adaptable, veo los desafíos como oportunidades de aprendizaje.", value: 23 },
    { description: "Pragmático y enfocado en la solución de problemas, busco resultados efectivos.", value: 23 },
    { description: "Creativo y visionario, disfruto explorando nuevas ideas y conceptos.", value: 23 },
    { description: "Empático y colaborativo, valoro el trabajo en equipo y las relaciones positivas.", value: 23 },
    { description: "Disfruto trabajando en equipo y valoro la colaboración.", value: 24 },
    { description: "Prefiero trabajar de manera independiente y tomar decisiones por mi cuenta.", value: 24 },
    { description: "Me siento más cómodo liderando un equipo que trabajando en él.", value: 24 },
    { description: "Depende del proyecto y de la situación, puedo adaptarme a diferentes enfoques de trabajo.", value: 24 },
    { description: "Basándome en datos y análisis cuidadoso.", value: 25 },
    { description: "Siguiendo mi intuición y mis sentimientos.", value: 25 },
    { description: "Consultando con otros y buscando diferentes perspectivas.", value: 25 },
    { description: "Tomando en cuenta el impacto a largo plazo de mis decisiones.", value: 25 },
    { description: "Trabajo que me permita expresar mi creatividad y originalidad.", value: 26 },
    { description: "Trabajo que desafíe mis habilidades técnicas y me permita innovar.", value: 26 },
    { description: "Trabajo que me permita colaborar con otros y contribuir al bien común.", value: 26 },
    { description: "Trabajo que me dé la oportunidad de liderar y marcar la diferencia.", value: 26 },
    { description: "Entorno de aprendizaje estructurado y organizado, con objetivos claros.", value: 27 },
    { description: "Entorno de aprendizaje interactivo y colaborativo, con actividades grupales.", value: 27 },
    { description: "Entorno de aprendizaje flexible y adaptado a mis necesidades individuales.", value: 27 },
    { description: "Entorno de aprendizaje experimental y basado en proyectos prácticos.", value: 27 },
    { description: "Mis intereses y pasiones personales.", value: 28 },
    { description: "Las oportunidades de crecimiento profesional y estabilidad financiera.", value: 28 },
    { description: "Mis habilidades y fortalezas personales.", value: 28 },
    { description: "La demanda del mercado laboral y las tendencias futuras.", value: 28 },
    { description: "Explorando nuevos lugares y culturas.", value: 29 },
    { description: "Disfrutando del descanso y la relajación en entornos naturales.", value: 29 },
    { description: "Participando en actividades emocionantes y llenas de aventura.", value: 29 },
    { description: "Dedicando tiempo a proyectos personales o actividades creativas.", value: 29 },
    { description: "Abordando el desafío con determinación y pensamiento estratégico.", value: 30 },
    { description: "Explorando diferentes enfoques y buscando soluciones innovadoras.", value: 30 },
    { description: "Buscando apoyo y colaboración de otros para enfrentar el desafío.", value: 30 },
    { description: "Afrontando el desafío con optimismo y confianza en mis habilidades.", value: 30 },
  ];
  //paginacion 
  paginaActual: number = 0;
  preguntasPorPagina: number = 5;
  totalPaginas: number = 0;
  respuestasContadas: number = 0;

  constructor(private route: ActivatedRoute, private datosService: DatosService, private router: Router) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const prueba_id = idParam !== null ? +idParam : 0;
    this.prueba_act = prueba_id;

    this.route.queryParams.subscribe(params => {
      const nueva = params['nueva'] === 'true';
      if (nueva) {
        this.cargarTodasLasPreguntas(prueba_id);
      } else {
        this.cargarPreguntasEnProceso(prueba_id);
      }
    });
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  handleBeforeUnload(event: BeforeUnloadEvent) {

    let idParam = this.route.snapshot.paramMap.get('id');
    let prueba_id = idParam !== null ? +idParam : 0;

    let user = localStorage.getItem('user');
    let user_id = user !== null ? JSON.parse(user).id : 0;

    this.datosService.verificarPrueba(user_id, prueba_id).subscribe(
      res => {
        if (res.completado === "En proceso") {
          this.actualizarProgreso('En proceso', "", "");
        }
      },
      err => {
        console.error(err);
      }
    );

    event.returnValue = ''; // Esto es necesario para que el navegador muestre el mensaje de confirmación
  }


  cargarTodasLasPreguntas(prueba_id: number) {
    this.prueba_act = prueba_id;
    this.datosService.preguntas_byprueba(prueba_id).subscribe(
      res => {
        this.preguntas = res.map((pregunta: any) => ({
          texto: pregunta.texto,
          respuesta: null
        }));
        this.actualizarPaginacion();
        this.crearProgreso();
      },
      err => {
        console.error(err);
      }
    );
  }

  cargarPreguntasEnProceso(prueba_id: number) {
    let user = localStorage.getItem('user');
    let user_id = user !== null ? JSON.parse(user).id : 0;
    this.datosService.verificarPrueba(user_id, prueba_id,).subscribe(
      res => {
        this.preguntas = res.progreso.map((pregunta: any) => ({
          texto: pregunta.texto,
          respuesta: pregunta.respuesta || null
        }));
        this.actualizarPaginacion();
        console.log('Cargando preguntas en proceso:', this.preguntas);
      },
      err => {
        console.error(err);
      }
    );
  }

  seleccionarRespuesta(index: number, respuesta: string) {

    const preguntaIndex = this.paginaActual * this.preguntasPorPagina + index;
    if (!this.preguntas[preguntaIndex].respuesta) {
      this.respuestasContadas++;
    }
    this.preguntas[preguntaIndex].respuesta = respuesta;


  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.preguntas.length / this.preguntasPorPagina);
  }

  get preguntasPaginadas(): Pregunta[] {
    const inicio = this.paginaActual * this.preguntasPorPagina;
    const fin = inicio + this.preguntasPorPagina;
    return this.preguntas.slice(inicio, fin);
  }

  paginaAnterior() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.paginaActual++;
    }
  }

  finalizarPrueba() {
    const preguntasSinResponder = this.preguntas.filter(pregunta => pregunta.respuesta === null);
    if (preguntasSinResponder.length > 0) {
      alert('Por favor responda todas las preguntas antes de finalizar la prueba.');
    } else {
      console.log('Preguntas:', this.preguntas);
      let resultado = ""
      this.datosService.predecirArea({ respuestasUsuario: this.preguntas }).subscribe(
        res => {
          console.log(res);
          this.actualizarProgreso('finalizado', res.area, res.motivo);
          this.router.navigate(['/home']);
        },
        err => {
          console.error(err);
        });


    }
  }

  crearProgreso() {
    let idParam = this.route.snapshot.paramMap.get('id');
    let prueba_id = idParam !== null ? +idParam : 0;

    let user = localStorage.getItem('user');
    let user_id = user !== null ? JSON.parse(user).id : 0;

    const progresoData = {
      prueba_id: prueba_id,
      usuario_id: user_id,
      progreso: JSON.stringify(this.preguntas),
      completado: "En proceso"
    };

    this.datosService.createProgreso(progresoData).subscribe(
      response => {
        console.log('Progreso creado:', response);
      },
      error => {
        console.error('Error al crear progreso:', error);
      }
    );
  }

  actualizarProgreso(etapa: string, area: string, motivo: string) {
    let idParam = this.route.snapshot.paramMap.get('id');
    let prueba_id = idParam !== null ? +idParam : 0;

    let user = localStorage.getItem('user');
    let user_id = user !== null ? JSON.parse(user).id : 0;

    const progresoData = {
      prueba_id: prueba_id,
      usuario_id: user_id,
      progreso: JSON.stringify(this.preguntas),
      completado: etapa,
      area: area,
      motivo: motivo
    };
    this.datosService.updateProgreso(progresoData).subscribe(
      response => {
        console.log('Progreso creado:', response);
      },
      error => {
        console.error('Error al crear progreso:', error);
      }
    );
  }



}
