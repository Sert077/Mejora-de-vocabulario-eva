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
        src: "Images/mono.jpg",
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
window.onload = function () {
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

    opciones.forEach(function (opcion, index) {
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

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('preg').style.display = 'inline-block';
    document.getElementById('createFilesButton').style.display = 'inline-block';
    document.getElementById('zip-button').style.display = 'display';
});


document.getElementById('createFilesButton').addEventListener('click', async () => {
    try {
        const htmlContent = document.documentElement.outerHTML;
        const cssContent = await getCSSContent();
        const jsContent = await getJavaScriptContent();

        const response = await fetch('/save-files-imagen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ htmlContent, cssContent, jsContent })
        });

        if (response.ok) {
            console.log('Archivos guardados exitosamente');
        } else {
            console.error('Error al guardar archivos:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error al procesar solicitud:', error);
    }
});


async function getCSSContent() {
    let styles = '';
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const fetchPromises = [];

    cssLinks.forEach(link => {
        if (link.href.includes('styles/estilos.css')) {
            fetchPromises.push(
                fetch(link.href)
                    .then(response => response.text())
                    .then(cssContent => {
                        styles += cssContent + '\n';
                    })
                    .catch(error => {
                        console.error('Error fetching CSS:', error);
                        reject(error); // Rechazar la Promesa en caso de error
                    })
            );
        }
    });

    await Promise.all(fetchPromises);

    return styles;
}

// Updated getJavaScriptContent function
async function getJavaScriptContent() {
    let scripts = '';
    const scriptTags = document.querySelectorAll('script[src="scripts/seleccion_imagenes.js"]');
    const fetchPromises = [];

    scriptTags.forEach(script => {
        fetchPromises.push(
            fetch(script.src)
                .then(response => response.text())
                .then(jsContent => {
                    scripts += jsContent + '\n';
                })
                .catch(error => {
                    console.error('Error fetching JavaScript:', error);
                    reject(error); // Rechazar la Promesa en caso de error
                })
        );
    });

    try {
        await Promise.all(fetchPromises);

    // Reemplazar otros códigos necesarios (ejemplo)
    const originalCode = `document.getElementById('preg').style.display = 'inline-block';`;
    const nuevoCode = `document.getElementById('preg').style.display = 'none';`;

    const originalCo = `document.getElementById('createFilesButton').style.display = 'inline-block';`;
    const nuevoCo = `document.getElementById('createFilesButton').style.display = 'none';`;

    const originalCod = `document.getElementById('zip-button').style.display = 'display';`;
    const nuevoCod = `document.getElementById('zip-button').style.display = 'none';`;
    
        // Recuperar las imágenes desde localStorage si existen
        let imagenesLocalStorage = localStorage.getItem('preguntas_seleccion_multiple');
        if (imagenesLocalStorage) {
            imagenesLocalStorage = JSON.parse(imagenesLocalStorage);
            // Crear una copia de las imágenes originales para no modificarlas
        let imagenesModificadas = imagenes.map(imagen => ({ ...imagen }));

        // Iterar sobre las imágenes de localStorage para añadir o modificar las existentes
        imagenesLocalStorage.forEach(imagenLocal => {
            // Buscar si la imagen de localStorage ya existe en las originales por src
            const index = imagenesModificadas.findIndex(imagenOrig => imagenOrig.src === imagenLocal.src);
            if (index !== -1) {
                // Si existe, reemplazarla con la versión de localStorage
                imagenesModificadas[index] = {
                    src: imagenLocal.src,
                    pregunta: imagenLocal.pregunta,
                    respuesta: imagenLocal.respuesta,
                    opciones: imagenLocal.opciones
                };
            } else {
                // Si no existe, agregarla al final de la lista
                imagenesModificadas.push({
                    src: imagenLocal.src,
                    pregunta: imagenLocal.pregunta,
                    respuesta: imagenLocal.respuesta,
                    opciones: imagenLocal.opciones
                });
            }
        });

        // Construir el código JavaScript con las imágenes modificadas
        let imagenesCode = 'var imagenes = [\n';
        imagenesModificadas.forEach((imagen, index) => {
            imagenesCode += `    {\n`;
            imagenesCode += `        src: "${imagen.src}",\n`;
            imagenesCode += `        pregunta: "${imagen.pregunta}",\n`;
            imagenesCode += `        respuesta: "${imagen.respuesta}",\n`;
            imagenesCode += `        opciones: ${JSON.stringify(imagen.opciones)}\n`;
            imagenesCode += `    }`;

            if (index < imagenesModificadas.length - 1) {
                imagenesCode += ',\n';
            } else {
                imagenesCode += '\n';
            }
        });
        imagenesCode += '];\n\n';

        // Reemplazar el código original con el código actualizado
        const original = /var\s+imagenes\s*=\s*\[[\s\S]*?\];/;
        const nuevo = imagenesCode;
        scripts = scripts.replace(original, nuevo);

        console.log(nuevo);

        
    scripts = scripts.replace(originalCode, nuevoCode);
    scripts = scripts.replace(originalCo, nuevoCo);
    scripts = scripts.replace(originalCod, nuevoCod);

        } else {
            console.warn('No hay imágenes almacenadas en localStorage. Se mantienen los cambios originales.');
            
    scripts = scripts.replace(originalCode, nuevoCode);
    scripts = scripts.replace(originalCo, nuevoCo);
    scripts = scripts.replace(originalCod, nuevoCod);
            return scripts; // Devolver scripts sin cambios si no hay imágenes en localStorage
        }

        

        

    } catch (error) {
        console.error('Error al cargar archivos JavaScript:', error);
        throw error; // Propagar el error para manejo superior
    }

    return scripts;
}


function mostrarLocalStorage() {
    // Recuperar el array de imágenes desde localStorage
    var imagenesRecuperadas = JSON.parse(localStorage.getItem('preguntas_seleccion_multiple'));

    // Verificar si hay imágenes recuperadas
    if (imagenesRecuperadas && imagenesRecuperadas.length > 0) {
        // Iterar sobre todas las imágenes y mostrar sus rutas
        imagenesRecuperadas.forEach((imagen, index) => {
            console.log(`Imagen ${index + 1}:`, imagen.src);
        });
    } else {
        console.log('No hay imágenes almacenadas en localStorage.');
    }
}


window.addEventListener('load', function () {
    //mostrarLocalStorage();
    //localStorage.clear();
});

// Nueva función para mostrar el mensaje de confirmación
function showConfirmationMessage() {
    alert('Prueba añadida correctamente al paquete SCORM');
}