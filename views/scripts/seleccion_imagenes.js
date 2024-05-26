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
        src: "Images/cebra.jpg", pregunta: "¿Qué animal es el que se muestra en la imagen?", respuesta: "cebra", 
        opciones: ["Aguila", "delfin", "cebra"]
    },
    { 
        src: "Images/jirafa.jpg", pregunta: "¿Qué animal es el que se muestra en la imagen?", respuesta: "jirafa" ,
        opciones: ["Aguila", "jirafa", "delfin"]
    },
    { 
        src: "Images/hipo.jpg", pregunta: "¿Qué animal es el que se muestra en la imagen?", respuesta: "hipopotamo" ,
        opciones: ["hipopotamo", "delfin", "mandir"]
    },
    { 
        src: "Images/leon.jpg", pregunta: "¿Qué animal es el que se muestra en la imagen?", respuesta: "leon",
        opciones: ["Aguila", "delfin", "leon"]
    },
    { 
        src: "Images/tiburon.jpg", pregunta: "¿Qué animal es el que se muestra en la imagen?", respuesta: "tiburon" ,
        opciones: ["Aguila", "delfin", "tiburon"]
    },

];
window.onload = function() {
    mostrarImagen();
};
var imagenIndex = 0;

function mostrarImagen() {
    // Obtener el contenedor de la imagen
    var imagenContenedor = document.querySelector('.imagen-contenedor');
    
    // Eliminar la imagen actual
    var imagenActual = document.querySelector('.imagen');
    if (imagenActual) {
        imagenActual.remove();
    }
    
    // Crear una nueva imagen con la clase 'imagen' y el efecto de carrusel
    var nuevaImagen = document.createElement('img');
    nuevaImagen.src = imagenes[imagenIndex].src;
    nuevaImagen.alt = "Imagen de un " + imagenes[imagenIndex].respuesta;
    nuevaImagen.classList.add('imagen');

    // Agregar la nueva imagen al contenedor
    imagenContenedor.appendChild(nuevaImagen);

    // Obtener el contenedor de opciones
    var opcionesContainer = document.querySelector('.opciones');
    opcionesContainer.innerHTML = '';

    // Obtener las opciones de respuesta para la imagen actual
    var opciones = imagenes[imagenIndex].opciones.slice(); // Hacer una copia del arreglo de opciones
    var respuesta = imagenes[imagenIndex].respuesta;

    // Insertar la respuesta correcta en una posición aleatoria
    var randomIndex = Math.floor(Math.random() * opciones.length);
    //opciones.splice(randomIndex, 0, respuesta);

    // Generar las opciones de respuesta dinámicamente
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
}



function verificarRespuesta() {
    var respuestaUsuario = document.querySelector('input[name="opcion"]:checked');
    if (respuestaUsuario) {
        if (respuestaUsuario.value === imagenes[imagenIndex].respuesta) {
            mostrarAlerta("¡Respuesta correcta! Efectivamente es un " + respuestaUsuario.value + ".", "alert-success");
            avanzarCarrusel();
            document.querySelector('.imagen-contenedor').classList.add('activar-carrusel');

        } else {
            mostrarAlerta("Respuesta incorrecta. Inténtalo de nuevo.", "alert-danger");
        }
    } else {
        mostrarAlerta("Por favor, seleccione una respuesta.", "alert-warning");
    }
}

function avanzarCarrusel() {
    imagenIndex++;
    if (imagenIndex >= imagenes.length) {
        imagenIndex = 0; // Si llegamos al final, volvemos al principio
    }
    mostrarImagen();
}

function mostrarAlerta(mensaje, tipo) {
    var alerta = document.createElement("div");
    alerta.classList.add("alert", tipo, "alert-small");
    alerta.textContent = mensaje;
    document.body.appendChild(alerta);

    // Ocultar la alerta después de 3 segundos
    setTimeout(function () {
        alerta.remove();
    }, 3000);
}

// Mostrar la primera imagen al cargar la página
mostrarImagen();

/*Fin Página cuestionario de vocabulario*/


//enviar a la otra pagina

document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los datos del formulario
    let formData = new FormData(this);

    // Realizar una solicitud AJAX para enviar los datos al servidor
    fetch("procesar_formulario.php", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es satisfactoria, redirigir a otra página
            window.location.href = "seleccion_multiple";
        } else {
            // Manejar errores
            console.error("Error al procesar el formulario");
        }
    })
    .catch(error => {
        console.error("Error de red:", error);
    });

});