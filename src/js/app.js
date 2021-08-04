document.addEventListener('DOMContentLoaded', function() {
	iniciarApp();
})

function iniciarApp() {
	console.log("iniciando app")
	mostrarServicios();
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