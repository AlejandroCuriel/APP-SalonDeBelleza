let pagina = 1;

const cita = {
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}
document.addEventListener('DOMContentLoaded', function() {
	iniciarApp();
})

function iniciarApp() {
	mostrarServicios();

  //Resalta el div actual segun el tab al que se presiona
  mostrarSeccion();

  //Oculta o muestra una seccion segun el tab al que se presiona
  cambiarSeccion();

  //Paginacion siguinete y anterior
  paginaSiguinete();
  paginaAnterior();

  //Muestra o ocultar los botones segun la pagina
  botonPaginador();

  //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
  mostrarResumen();
}

function mostrarSeccion() {
  //Eliminar mostrar-seccion de la seccion anterior
  const seccionAterior = document.querySelector('.show-section')
  if(seccionAterior) {
    seccionAterior.classList.remove('show-section');
  }

  const seccionActual = document.querySelector(`#step-${pagina}`)
  seccionActual.classList.add('show-section');

  //Eliminar la clase de actual en el tab anterior
  const tabAnterior = document.querySelector('.tabs .actual')
  if(tabAnterior){ 
    tabAnterior.classList.remove('actual');
  }
      
  //Resalta el Tab actual
  const tab = document.querySelector(`[data-step="${pagina}"]`)
  tab.classList.add('actual');
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll('.tabs button')
  enlaces.forEach( enlace => {
    enlace.addEventListener('click', e => {
      e.preventDefault();
      pagina = parseInt(e.target.dataset.step);
      mostrarSeccion();
      botonPaginador();
    })
  })
}

async function mostrarServicios() {
	try {
		const resultado = await fetch('./servicios.json')
		const db = await resultado.json();
		const { servicios } = db;

		// Generar el HTML
		servicios.forEach( servicio => {
			const { id, nombre, precio } = servicio;

			// DOM Scripting

			// Generar nombre de servicio
			const nombreServicio = document.createElement('P');
			nombreServicio.textContent = nombre;
			nombreServicio.classList.add('service--name');

			//Generar precio de servicio
			const precioServicio = document.createElement('P');
			precioServicio.textContent = `$ ${ precio }`;
			precioServicio.classList.add('service--price');

			//Generar Div contenedor de servicio
			const servicioDiv = document.createElement('DIV');
			servicioDiv.classList.add('service');
			servicioDiv.dataset.idServicio = id;

			//Selecciona un serivico para la cita
			servicioDiv.onclick = seleccionarServicio;

			//Inyectar precio y nombre en div de servicio
			servicioDiv.appendChild(nombreServicio);
			servicioDiv.appendChild(precioServicio);

			//inyectamos en html
			document.querySelector('#services').appendChild(servicioDiv)
		})
	} catch (error) {
		console.log(error)
	}
}

function seleccionarServicio(e) {
	let elemento;
	//Forzar que al elemento al que se da click sea el DIV
	if(e.target.tagName === 'P'){
		elemento = e.target.parentElement;
	} else{
		elemento = e.target
	}
  console.log(elemento)
	if(elemento.classList.contains('selected')){
		elemento.classList.remove('selected');

    const id = parseInt(elemento.dataset.idServicio);

    eliminarServicio(id);
	}else{
		elemento.classList.add('selected')

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent
    }

    agregarServicio(servicioObj);
	}
}

function agregarServicio(servicioObj) { 
  const { servicios } = cita;
  cita.servicios = [...servicios, servicioObj];
  console.log(cita);
}

function eliminarServicio(id) {
  console.log('Eliminando..', id)
  const { servicios } = cita;
  cita.servicios = servicios.filter( servicio => servicio.id !== id)
  console.log(cita)
}

function paginaSiguinete() {
  const paginaSiguinete = document.querySelector('#next')
  paginaSiguinete.addEventListener('click', function() {
    pagina++;
    botonPaginador();
  })
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector('#before')
  paginaAnterior.addEventListener('click', function() {
    pagina--;
    botonPaginador();
  })
}

function botonPaginador() {
	const paginaSiguinete = document.querySelector('#next')
	const paginaAnterior = document.querySelector('#before')
  if(pagina === 1) {
    paginaAnterior.classList.add('hide');
  } else if(pagina === 3){
    paginaSiguinete.classList.add('hide');
    paginaAnterior.classList.remove('hide')
  } else {
    paginaAnterior.classList.remove('hide');
    paginaSiguinete.classList.remove('hide');
  }
  mostrarSeccion(); //Cambia la seccion que se muestra por la pagina
}

function mostrarResumen(){
  //Destructuring
  const { nombre, fecha, hora, servicio } = cita;

  //Seleccionar el resumen
  const resumenDiv = document.querySelector('.content__summary')

  //Validacion de objeto
  if(Object.values(cita).includes('')){
    const noServicios = document.createElement('P')
    noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';
    noServicios.classList.add('content__appointment--invalidate')
  
    //Agregar a resumen Div
    resumenDiv.appendChild(noServicios)
  }

}