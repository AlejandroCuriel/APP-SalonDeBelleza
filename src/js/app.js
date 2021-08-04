let pagina = 1;

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
		elemento.classList.remove('selected')
	}else{
		elemento.classList.add('selected')
	}
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