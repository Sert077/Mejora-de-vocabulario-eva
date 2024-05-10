/*Página cuestionario de vocabulario*/
window.onload = function() {
    cambiarOracion();
    convertirTexto()
};
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
  
    // Verificar si el destino es el contenedor de la oración
    if (event.target.id === "contenedor-oracion") {
      // Si el destino es el contenedor de la oración, agregar la palabra al contenedor de oración
      event.target.appendChild(draggedElement);
    } else if (event.target.id === "contenedor-palabras") {
      // Si el destino es el contenedor de palabras, devolver la palabra al contenedor de palabras original
      var contenedorPalabras = document.getElementById("contenedor-palabras");
      contenedorPalabras.appendChild(draggedElement);
    } else if (event.target.id === "area-devolucion") {
      // Si el destino es el área de devolución, devolver la palabra al contenedor de palabras original
      var contenedorPalabras = document.getElementById("contenedor-palabras");
      contenedorPalabras.appendChild(draggedElement);
    }
}
  
// Función para proporcionar una pista al usuario
function obtenerPista() {
    // Obtener la oración completa y dividirla en palabras
    var oracionCorrecta = oraciones[indiceActual].split(" ");
    
    // Encontrar una palabra que aún no se haya colocado en la posición correcta
    var contenedorOracion = document.getElementById("contenedor-oracion");
    var palabrasOracion = contenedorOracion.querySelectorAll("div");

    for (var i = 0; i < oracionCorrecta.length; i++) {
        var palabraCorrecta = oracionCorrecta[i];
        var encontrada = false;

        for (var j = 0; j < palabrasOracion.length; j++) {
            var palabraIngresada = palabrasOracion[j].textContent;
            
            // Si la palabra de la oración correcta no está en el contenedor de la oración, mostrarla como pista
            if (palabraCorrecta === palabraIngresada) {
                encontrada = true;
                break;
            }
        }

        // Si la palabra correcta no se encontró en la oración ingresada, mostrarla como pista
        if (!encontrada) {
            alert("Pista: La palabra '" + palabraCorrecta + "' debería ir en esta posición.");
            break;
        }
    }
}

// Función para verificar la oración del usuario y resaltar errores
function verificarOracion() {
    var contenedor = document.getElementById("contenedor-oracion");
    var palabras = contenedor.querySelectorAll("div");
    var fraseAcomodada = Array.from(palabras).map(div => div.textContent).join(" ");
    var fraseIngresada = document.getElementById("inputTexto").value.trim(); 
    var resultado = document.getElementById("resultado");

    // Obtener la cantidad de palabras necesarias para completar la oración
    var palabrasCorrectas = oraciones[indiceActual].split(" ");
    var cantidadPalabrasNecesarias = palabrasCorrectas.length;

    // Obtener la cantidad de palabras ingresadas por el usuario
    var palabrasIngresadas = fraseIngresada.split(" ");

    // Verificar si el usuario ha ingresado al menos la cantidad de palabras necesarias para completar la oración
    if (palabrasIngresadas.length < cantidadPalabrasNecesarias) {
        resultado.textContent = "Ingresa más palabras para completar la oración.";
        resultado.style.color = "red";
        return; // Salir de la función si no se ha ingresado suficientes palabras
    }

    if (fraseAcomodada === fraseIngresada) {
        resultado.textContent = "¡Excelente, oración completada correctamente!";
        resultado.style.color = "green";
        
        // Resaltar las palabras en verde si están en la posición correcta
        for (var i = 0; i < palabras.length; i++) {
            if (palabras[i].textContent === palabrasCorrectas[i]) {
                palabras[i].style.color = "green";
            } else {
                palabras[i].style.color = ""; // Restablecer el color si la palabra no está en la posición correcta
            }
        }
    } else {
        resultado.textContent = "La oración no está en el orden correcto. ¡Inténtalo de nuevo!";
        resultado.style.color = "red";

        // Resaltar las palabras en rojo si no están en la posición correcta
        for (var i = 0; i < palabras.length; i++) {
            if (palabras[i].textContent !== palabrasIngresadas[i]) {
                palabras[i].style.color = "red";
            } else {
                palabras[i].style.color = ""; // Restablecer el color si la palabra está en la posición correcta
            }
        }
    }
}


function convertirTexto() {
    var contenedorOracion = document.getElementById("contenedor-oracion");
    var input = document.getElementById("inputTexto").value.trim(); 
    if (input.length === 0) { 
        return; 
    }
    if(contenedorOracion){
        contenedorOracion.innerHTML = ''; 
    }
    var palabras = input.split(/\s+/); 
    shuffleArray(palabras);
    var contenedor = document.getElementById("contenedor-palabras");
    contenedor.innerHTML = ''; 

    palabras.forEach((palabra, index) => {
        var div = document.createElement("div");
        div.className = "btn btn-outline-info"; 
        div.setAttribute("draggable", "true");
        div.setAttribute("ondragstart", "drag(event)");
        div.id = "palabra" + (index + 1); 
        div.textContent = palabra; 
        contenedor.appendChild(div); 
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

function reset() {
    var contenedorOracion = document.getElementById("contenedor-oracion");
    var contenedorPalabras = document.getElementById("contenedor-palabras");
    
    // Eliminar todas las palabras del contenedor de oración
    while (contenedorOracion.firstChild) {
        contenedorPalabras.appendChild(contenedorOracion.firstChild);
    }

    // Eliminar cualquier estilo aplicado a las palabras restantes en el contenedor de palabras
    var palabrasContenedor = contenedorPalabras.querySelectorAll("div");
    palabrasContenedor.forEach(palabra => {
        palabra.style.color = "";
    });

    var resultado = document.getElementById("resultado");
    if (resultado) {
        resultado.textContent = '';
    }
}


var oraciones = [
    "Escuchar atentamente no es lo mismo que oír.",
    "Las estrellas titilaban en el cielo nocturno.",
    "La luna creciente iluminaba tenuemente el sendero.",
    "Las campanas del templo repicaban al atardecer.",
    "A palabras necias, oídos sordos.",
    "Los astrofísicos divagan sobre los misterios del universo infinito.",
];
var indiceActual = 0;

// Función para cambiar la oración mostrada en el input
function cambiarOracion() {
    var input = document.getElementById('inputTexto');
    input.value = oraciones[indiceActual];
    indiceActual = (indiceActual + 1) % oraciones.length; // Circular por el array
}

// Función para mostrar u ocultar el input
function mostrarInput() {
    var input = document.getElementById('inputTexto');
    if (input.style.display === 'none') {
        input.style.display = 'block';
    } else {
        input.style.display = 'none';
    }
}

/*Fin Página cuestionario de vocabulario*/