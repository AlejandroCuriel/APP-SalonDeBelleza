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

  //Almacena el nombre en el objeto de cita
  nombreCita();

  //Almacena la fecha de la cita en el objeto
  fechaCita();

  //Almacena la hora de la cita del objeto
  horaCita();

  //Deshabilita dias pasados
  deshabilitarFechaAnterior();


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
    const url = "http://localhost:3000/servicios.php";

		const resultado = await fetch(url);
		const db = await resultado.json();
    console.log(db);
		// Generar el HTML
		db.forEach( servicio => {
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
    mostrarResumen(); //Estamos en la apgina 3, carga el resumen de la cita
  } else {
    paginaAnterior.classList.remove('hide');
    paginaSiguinete.classList.remove('hide');
  }
  mostrarSeccion(); //Cambia la seccion que se muestra por la pagina
}

function mostrarResumen(){
  //Destructuring
  const { nombre, fecha, hora, servicios } = cita;

  //Seleccionar el resumen
  const resumenDiv = document.querySelector('.summary__content')

  // Limpia el HTML previo
  while( resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild)
  }

  //Validacion de objeto
  if(Object.values(cita).includes('') || cita.servicios ==='') {
    const noServicios = document.createElement('P')
    noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';
    noServicios.classList.add('content__appointment--invalidate')
  
    //Agregar a resumen Div
    resumenDiv.appendChild(noServicios)
    return;
  } 

  const headingCita = document.createElement('H3')
  headingCita.textContent = 'Resumen de Cita';

  //Mostramos el resumen
  const nombreCita = document.createElement('P');
  nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  const serviciosCita = document.createElement('DIV');
  serviciosCita.classList.add('summary__content');

  const headingServicios = document.createElement('H3')
  headingServicios.textContent = 'Resumen de Servicios';

  serviciosCita.appendChild(headingServicios);

  let cantidad = 0;

  //Iterar sobre el arreglo de servicios
  servicios.forEach(servicio => {
    const { nombre, precio } = servicio;
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('summary__services');

    const textServicio = document.createElement('P');
    textServicio.textContent = nombre;

    const precioServicio = document.createElement('P');
    precioServicio.textContent = precio;
    precioServicio.classList.add('price');

    const totalServicio = precio.split('$')
    cantidad += parseInt(totalServicio[1].trim());
    

    console.log(cantidad)
    //Colocar text y precio en el div
    contenedorServicio.appendChild(textServicio);
    contenedorServicio.appendChild(precioServicio);

    serviciosCita.appendChild(contenedorServicio)
  })
  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);
  resumenDiv.appendChild(serviciosCita);
  
  const cantidadPagar = document.createElement('P');
  cantidadPagar.classList.add('total');
  cantidadPagar.innerHTML = `<span> Total a Pagar: $</span> ${cantidad}`;
  resumenDiv.appendChild(cantidadPagar);

}

function nombreCita() {
  const nombreInput = document.querySelector('#name')
  nombreInput.addEventListener('input', e => {
    const nombreTexto = e.target.value.trim(); //Trim nos ayuda a eliminar los espacios vacios al inicio y final
    
    //Validacion que de nombreTexto debe tener algo 
    if(nombreTexto === '' || nombreTexto.length < 3){
      mostrarAlerta('Nombre Invalido', 'error')
    }else {
      const alerta = document.querySelector('.alert')
      if(alerta){
        alerta.remove();
      }
      cita.nombre = nombreTexto
      
    }
  })
}

function mostrarAlerta(mensaje, tipo) {
  //Si hay una alerta ya existente no crear otra
  const alertaPrevia = document.querySelector('.alert')
  if(alertaPrevia){
    return;
  }
  
  const alerta = document.createElement('DIV')
  alerta.textContent = mensaje;
  alerta.classList.add('alert');
  if(tipo === 'error') {
    alerta.classList.add('error')
  }

  //Insertar en el HTML
  const formulario = document.querySelector('.form');
  formulario.appendChild(alerta);

  //ELiminar alerta despues de 3 segundos
  setTimeout(() => {
    alerta.remove()
  },3000)
}

function fechaCita() {
  const fechaInput = document.querySelector('#date');
  fechaInput.addEventListener('input', e => {
    console.log(e.target.value)
    const dia = new Date(e.target.value).getUTCDay();

    if([0, 6].includes(dia)){
      e.preventDefault();
      fechaInput.value = '' //Hacemos que quede en blanco el campo de fecha
      mostrarAlerta('Fines de semana no son permitidos', 'error');
    } else {
      cita.fecha = fechaInput.value;
      console.log(cita);
    }
    console.log(dia)
    // const opciones = {
    //   weekday: 'long',
    //   year: 'numeric',
    //   month: 'long'
    // // }
    // console.log(dia.toLocaleDateString('es-ES', opciones))
  })
}

function deshabilitarFechaAnterior() {
  const inputFecha = document.querySelector('#date')
  const fechaActual = new Date();
  const year = fechaActual.getFullYear();
  const mes = fechaActual.getMonth() + 1;
  const dia = fechaActual.getDate() + 1;

  //Formato deseado: AAA-MM-DD
  const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`
  inputFecha.min = fechaDeshabilitar
  console.log(fechaDeshabilitar)
  console.log(fechaDeshabilitar)
}

function horaCita() {
  const inputHora = document.querySelector('#hour')
  inputHora.addEventListener('input', e => {
    const horaCita = e.target.value;
    const hora = horaCita.split(':')
    if(hora[0] < 10 || hora[0] > 20){
      mostrarAlerta('Hora no valida','error')
      inputHora.value = ''
    } else {
      cita.hora = horaCita;
    }
    console.log(cita)
  })
}