// Array de imágenes con preguntas y respuestas
var imagenes = [
    { 
        src: "Images/gato_01.jpeg", 
        pregunta: "¿Qué animal es el que se muestra en la imagen?", 
        respuesta: "gato",
        opciones: ["gato", "perro", "mono"]
    },
    { 
        src: "Images/perro.jpg", 
        pregunta: "¿Qué animal es el que se muestra en la imagen?", 
        respuesta: "perro",
        opciones: ["perro", "delfin", "mono"]
    },
    { 
        src:"Images/mono.jpg", 
        pregunta: "¿Qué animal es el que se muestra en la imagen?", 
        respuesta: "mono",
        opciones: ["Aguila", "delfin", "mono"]
    },
    { 
        src: "Images/hipo.jpg", 
        pregunta: "¿Qué animal es el que se muestra en la imagen?", 
        respuesta: "hipopotamo",
        opciones: ["hipopotamo", "delfin", "mandir"]
    },
    { 
        src: "Images/leon.jpg", 
        pregunta: "¿Qué animal es el que se muestra en la imagen?", 
        respuesta: "leon",
        opciones: ["Aguila", "delfin", "leon"]
    }
];

// Función para cargar los datos almacenados en localStorage si existen
function cargarDatosDesdeLocalStorage() {
    var preguntasGuardadas = localStorage.getItem('preguntas_seleccion_multiple');
    if (preguntasGuardadas) {
        imagenes = JSON.parse(preguntasGuardadas);
    }
}

// Función para guardar los datos actualizados en localStorage
function guardarDatosEnLocalStorage() {
    localStorage.setItem('preguntas_seleccion_multiple', JSON.stringify(imagenes));
}

// Cargar datos desde localStorage al cargar la página
window.onload = function() {
    cargarDatosDesdeLocalStorage();
    mostrarImagen();
};

var imagenIndex = 0;

function mostrarImagen() {
    var imagenContenedor = document.querySelector('.imagen-contenedor');
    
    var imagenActual = document.querySelector('.imagen');
    if (imagenActual) {
        imagenActual.remove();
    }
    
    var nuevaImagen = document.createElement('img');
    nuevaImagen.src = imagenes[imagenIndex].src;
    nuevaImagen.alt = "Imagen de un " + imagenes[imagenIndex].respuesta;
    nuevaImagen.classList.add('imagen');
    imagenContenedor.appendChild(nuevaImagen);

    var opcionesContainer = document.getElementById('opciones-container');
    opcionesContainer.innerHTML = '';

    var opciones = imagenes[imagenIndex].opciones.slice();
    var respuesta = imagenes[imagenIndex].respuesta;

    opciones.forEach(function(opcion, index) {
        var input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'opcion');
        input.setAttribute('id', 'opcion' + (index + 1));
        input.setAttribute('value', opcion);
        input.classList.add('form-check-input');

        var label = document.createElement('label');
        label.setAttribute('for', 'opcion' + (index + 1));
        label.classList.add('form-check-label');
        label.innerText = opcion;

        var div = document.createElement('div');
        div.classList.add('form-check', 'form-check-inline');
        div.appendChild(input);
        div.appendChild(label);

        opcionesContainer.appendChild(div);
    });

    document.getElementById('pregunta').innerText = imagenes[imagenIndex].pregunta;
}

// Variable para almacenar la calificación
var calificacion = 0;

// Variable para almacenar la calificación y el número de respuestas correctas
var calificacion = 0;
var respuestasCorrectas = 0;

// Función para verificar la respuesta
function verificarRespuesta() {
    var respuestaUsuario = document.querySelector('input[name="opcion"]:checked');
    if (respuestaUsuario) {
        if (respuestaUsuario.value === imagenes[imagenIndex].respuesta) {
            mostrarAlerta("¡Respuesta correcta! Efectivamente es un " + respuestaUsuario.value + ".", "alert-success");
            respuestasCorrectas++;
            calificacion = respuestasCorrectas * 20; // Calificación en porcentaje (20 puntos por respuesta correcta)
            if (calificacion > 100) {
                calificacion = 100; // Limitar la calificación a 100%
            }
            actualizarCalificacion(); // Actualizar la visualización de la calificación
            avanzarCarrusel();
        } else {
            mostrarAlerta("Respuesta incorrecta. Inténtalo de nuevo.", "alert-danger");
        }
    } else {
        mostrarAlerta("Por favor, seleccione una respuesta.", "alert-warning");
    }
}

// Función para actualizar la visualización de la calificación
function actualizarCalificacion() {
    var calificacionPorcentaje = calificacion + "%";
    document.getElementById('calificacion').innerText = "Calificación: " + calificacionPorcentaje;
}



function avanzarCarrusel() {
    imagenIndex++;
    if (imagenIndex >= imagenes.length) {
        imagenIndex = 0;
    }
    mostrarImagen();
}

function mostrarAlerta(mensaje, tipo) {
    var alerta = document.createElement("div");
    alerta.classList.add("alert", tipo, "alert-small");
    alerta.textContent = mensaje;
    document.getElementById('alert-container').appendChild(alerta);

    setTimeout(function () {
        alerta.remove();
    }, 3000);
}

function mostrarFormularioEdicion() {
    document.getElementById('formulario-edicion').style.display = 'block';
    document.getElementById('pregunta').style.display = 'none';
    document.getElementById('opciones-container').style.display = 'none';
    document.querySelector('.imagen-contenedor').style.display = 'none';

    // Rellenar el formulario con los datos actuales de la pregunta
    document.getElementById('nueva-pregunta').value = imagenes[imagenIndex].pregunta;
    document.getElementById('nueva-respuesta').value = imagenes[imagenIndex].respuesta;
    document.getElementById('nueva-opcion1').value = imagenes[imagenIndex].opciones[0];
    document.getElementById('nueva-opcion2').value = imagenes[imagenIndex].opciones[1];
    document.getElementById('nueva-opcion3').value = imagenes[imagenIndex].opciones[2];
}

function cancelarEdicion() {
    document.getElementById('formulario-edicion').style.display = 'none';
    document.getElementById('pregunta').style.display = 'block';
    document.getElementById('opciones-container').style.display = 'block';
    document.querySelector('.imagen-contenedor').style.display = 'block';
}

function guardarEdicion() {
    var nuevaPregunta = document.getElementById('nueva-pregunta').value;
    var nuevaRespuesta = document.getElementById('nueva-respuesta').value;
    var nuevaOpcion1 = document.getElementById('nueva-opcion1').value;
    var nuevaOpcion2 = document.getElementById('nueva-opcion2').value;
    var nuevaOpcion3 = document.getElementById('nueva-opcion3').value;
    var nuevaImagenInput = document.getElementById('nueva-imagen');

    if (nuevaImagenInput.files && nuevaImagenInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            imagenes[imagenIndex].src = e.target.result;
            actualizarDatosPregunta(nuevaPregunta, nuevaRespuesta, nuevaOpcion1, nuevaOpcion2, nuevaOpcion3);
        }
        reader.readAsDataURL(nuevaImagenInput.files[0]);
    } else {
        actualizarDatosPregunta(nuevaPregunta, nuevaRespuesta, nuevaOpcion1, nuevaOpcion2, nuevaOpcion3);
    }
}

function actualizarDatosPregunta(pregunta, respuesta, opcion1, opcion2, opcion3) {
    imagenes[imagenIndex].pregunta = pregunta;
    imagenes[imagenIndex].respuesta = respuesta;
    imagenes[imagenIndex].opciones = [opcion1, opcion2, opcion3];

    guardarDatosEnLocalStorage(); // Guardar los datos actualizados en localStorage
    cancelarEdicion();
    mostrarImagen();
    mostrarAlerta("Pregunta actualizada con éxito.", "alert-success");
}
