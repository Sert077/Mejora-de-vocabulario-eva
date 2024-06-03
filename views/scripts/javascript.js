/*Página cuestionario de vocabulario*/
window.onload = function() {
    cambiarOracion();
    convertirTexto();
    
    var role = getParameterByName('role');
    if (role === 'teacher') {
        mostrarInput(true);
    } else {
        mostrarInput(false);
    }
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

var oracionesCorrectas = 0; // Contador global de oraciones correctas
var totalOraciones = 6; // Total de oraciones en el cuestionario

// Función para actualizar la calificación en el HTML
function actualizarCalificacion() {
    var calificacion = (oracionesCorrectas / totalOraciones) * 100;
    document.getElementById("calificacion").textContent = "Calificación: " + calificacion.toFixed(2) + "%";
}

// Modificar la función verificarOracion para incrementar el contador cuando la oración sea correcta
function verificarOracion() {
    var contenedor = document.getElementById("contenedor-oracion");
    var palabras = contenedor.querySelectorAll("div");
    var fraseAcomodada = Array.from(palabras).map(div => div.textContent).join(" ");
    var fraseIngresada = document.getElementById("inputTexto").value.trim(); 
    var resultado = document.getElementById("resultado");

    var palabrasCorrectas = oraciones[indiceActual].split(" ");
    var cantidadPalabrasNecesarias = palabrasCorrectas.length;
    var palabrasIngresadas = fraseIngresada.split(" ");

    if (palabrasIngresadas.length < cantidadPalabrasNecesarias) {
        resultado.textContent = "Ingresa más palabras para completar la oración.";
        resultado.style.color = "red";
        return;
    }

    if (fraseAcomodada === fraseIngresada) {
        resultado.textContent = "¡Excelente, oración completada correctamente!";
        resultado.style.color = "green";

        // Incrementar el contador de oraciones correctas
        oracionesCorrectas++;
        actualizarCalificacion(); // Actualizar la calificación en el HTML

        for (var i = 0; i < palabras.length; i++) {
            if (palabras[i].textContent === palabrasCorrectas[i]) {
                palabras[i].style.color = "green";
            } else {
                palabras[i].style.color = "";
            }
        }
    } else {
        resultado.textContent = "La oración no está en el orden correcto. ¡Inténtalo de nuevo!";
        resultado.style.color = "red";

        for (var i = 0; i < palabras.length; i++) {
            if (palabras[i].textContent !== palabrasIngresadas[i]) {
                palabras[i].style.color = "red";
            } else {
                palabras[i].style.color = "";
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
    "Escuchar atentamente no es lo mismo que oír",
    "Las estrellas titilaban en el cielo nocturno",
    "La luna creciente iluminaba tenuemente el sendero",
    "Las campanas del templo repicaban al atardecer",
    "A palabras necias, oídos sordos",
    "Los astrofísicos divagan sobre los misterios del universo infinito",
];
var indiceActual = 0;

// Función para cambiar la oración mostrada en el input
function cambiarOracion() {
    var input = document.getElementById('inputTexto');
    input.value = oraciones[indiceActual];
    indiceActual = (indiceActual + 1) % oraciones.length; // Circular por el array
}

// Función para mostrar u ocultar el input
function mostrarInput(mostrar) {
    var input = document.getElementById('inputTexto');
    var botonGuardar = document.querySelector('button[onclick^="convertirGuardar"]');
    if (mostrar) {
        input.style.display = 'block';
        botonGuardar.style.display = 'block';
    } else {
        input.style.display = 'none';
        botonGuardar.style.display = 'none';
    }
}

// Función para obtener las oraciones del localStorage
function obtenerOracionesGuardadas() {
    var oracionesGuardadas = localStorage.getItem('oraciones');
    return oracionesGuardadas ? JSON.parse(oracionesGuardadas) : null;
}

// Función para guardar las oraciones en el localStorage
function guardarOraciones(oraciones) {
    localStorage.setItem('oraciones', JSON.stringify(oraciones));
}

// Cargar oraciones guardadas al cargar la página
window.onload = function() {
    var oracionesGuardadas = obtenerOracionesGuardadas();
    if (oracionesGuardadas) {
        oraciones = oracionesGuardadas;
    }
    cambiarOraciones();
    var role = getParameterByName('role');
    if (role === 'teacher') {
        mostrarInput(true);
    } else {
        mostrarInput(false);
    }
};

// Función para cambiar la oración mostrada en el input
function cambiarOraciones() {
    var input = document.getElementById('inputTexto');
    input.value = oraciones[indiceActual];
    indiceActual = (indiceActual + 1) % oraciones.length; // Circular por el array
    convertirGuardar(); // Llamar a convertirGuardar después de cambiar la oración
}

// Función para convertir texto
function convertirGuardar() {
    var input = document.getElementById("inputTexto").value.trim(); 
    if (input.length === 0) { 
        return; 
    }
    
    // Actualizar la oración en el array 'oraciones' y guardar en localStorage
    oraciones[indiceActual === 0 ? oraciones.length - 1 : indiceActual - 1] = input;
    guardarOraciones(oraciones);
    
    // Mostrar la oración editada en el input
    document.getElementById('inputTexto').value = input;

    // Convertir texto ingresado en palabras para el contenedor de palabras
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

/*Fin Página cuestionario de vocabulario*/