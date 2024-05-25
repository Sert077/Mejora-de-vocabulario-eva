let preguntas = [
    {
        enunciado: "La _ _ _ _ _ _ es una fruta muy dulce y con muchas pepas.",
        opciones: ["Manzana", "Plátano", "Sandía", "Naranja"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "Me gusta mucho _ _ _ _ _ en el parque los domingos.",
        opciones: ["Jugar", "Comer", "Leer", "Bailar"],
        respuestaCorrecta: "a"
    },
    {
        enunciado: "_ _ _ _ _ _ _ es el planeta más grande del sistema solar.",
        opciones: ["Sol", "Luna", "Júpiter", "Marte"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "El color _ _ _ _ _ es muy relajante y se asocia con el mar.",
        opciones: ["Rojo", "Verde", "Azul", "Amarillo"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "Los animales que solo comen plantas se llaman _ _ _ _ _ _ _ _ _ .",
        opciones: ["Carnívoros", "Omnívoros", "Herbívoros", "Insectívoros"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "Una herramienta común para golpear clavos es el _ _ _ _ _ _ _ .",
        opciones: ["Destornillador", "Martillo", "Alicate", "Sierra"],
        respuestaCorrecta: "b"
    },
    {
        enunciado: "El aparato que se utiliza para medir la temperatura es el _ _ _ _ _ _ _ _ _ .",
        opciones: ["Barómetro", "Anemómetro", "Termómetro", "Higrómetro"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "La capital de Francia es _ _ _ _ _ .",
        opciones: ["Berlín", "Madrid", "París", "Londres"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "El animal conocido por su largo cuello es la _ _ _ _ _ _ _ .",
        opciones: ["Pantera", "Jirafa", "Elefante", "Rinoceronte"],
        respuestaCorrecta: "b"
    },
    {
        enunciado: "El instrumento musical que tiene teclas blancas y negras es el _ _ _ _ _ .",
        opciones: ["Guitarra", "Violín", "Piano", "Flauta"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "El elemento químico que tiene el símbolo O es el _ _ _ _ _ _ _ _ .",
        opciones: ["Hierro", "Oro", "Oxígeno", "Plata"],
        respuestaCorrecta: "c"
    },
    {
        enunciado: "El deporte que se juega con un bate y una pelota es el _ _ _ _ _ _ _ _ .",
        opciones: ["Fútbol", "Baloncesto", "Béisbol", "Voleibol"],
        respuestaCorrecta: "c"
    }
];

let indiceActual = 0;
const preguntasPorGrupo = 3;

function cargarPreguntasDesdeLocalStorage() {
    const preguntasGuardadas = localStorage.getItem('preguntas');
    if (preguntasGuardadas) {
        preguntas = JSON.parse(preguntasGuardadas);
    }
}

function cargarNuevasPreguntas() {
    document.querySelector('button[onclick="retrocederPreguntas()"]').disabled = false;
    const preguntasContainer = document.getElementById('preguntasContainer');
    preguntasContainer.innerHTML = ''; 

    const fin = Math.min(indiceActual + preguntasPorGrupo, preguntas.length);
    for (let i = indiceActual; i < fin; i++) {
        const pregunta = preguntas[i];
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta-cf';
        let opcionesHTML = '';
        pregunta.opciones.forEach((opcion, idx) => {
            const letra = ['a', 'b', 'c', 'd'][idx];
            opcionesHTML += `<label><input type="radio" name="opcion${i + 1}" value="${letra}" onchange="actualizarEnunciado(${i}, '${letra}')"> ${letra}) ${opcion}</label>`;
        });
        
        preguntaDiv.innerHTML = `
            <p id="enunciado${i + 1}">${i + 1}. ${pregunta.enunciado}</p>
            <div class="opciones-cf">
                ${opcionesHTML}
            </div>
        `;
        preguntasContainer.appendChild(preguntaDiv);
    }
    indiceActual = fin; 
    if (indiceActual >= preguntas.length) {
        document.querySelector('button[onclick="cargarNuevasPreguntas()"]').disabled = true; // Deshabilitar botón si no hay más preguntas
    }
}

function actualizarEnunciado(indicePregunta, letraSeleccionada) {
    const pregunta = preguntas[indicePregunta];
    const enunciadoElement = document.getElementById(`enunciado${indicePregunta + 1}`);
    const textoSeleccionado = pregunta.opciones[['a', 'b', 'c', 'd'].indexOf(letraSeleccionada)];
    const nuevoEnunciado = pregunta.enunciado.replace('_ _ _ _ _ _', textoSeleccionado);
    enunciadoElement.innerHTML = `${indicePregunta + 1}. ${nuevoEnunciado}`;
}

function verificarRespuestas() {
    let aciertos = 0;
    let resultadoTexto = "";

    for (let i = 0; i < preguntas.length; i++) {
        const respuestaSeleccionadaElement = document.querySelector(`input[name="opcion${i + 1}"]:checked`);
        
        if (respuestaSeleccionadaElement) {
            
            const respuestaSeleccionada = respuestaSeleccionadaElement.value;
            if (respuestaSeleccionada === preguntas[i].respuestaCorrecta) {
                aciertos++;
            }
        }
    }

    if (aciertos === preguntas.length) {
        resultadoTexto = "¡Perfecto! Todas las respuestas son correctas.";
    } else {
        resultadoTexto = `Has acertado ${aciertos} preguntas.`;
    }

    document.getElementById("resultado").textContent = resultadoTexto;
    setTimeout(() => {
        document.getElementById("resultado").textContent = "";
    }, 2000);
}

function retrocederPreguntas() {
    document.querySelector('button[onclick="cargarNuevasPreguntas()"]').disabled = false;
    let inicioAnterior = Math.max(indiceActual - preguntasPorGrupo * 2, 0);

    if (inicioAnterior === indiceActual) {
        alert("No hay más preguntas anteriores.");
        return;
    }

    indiceActual = inicioAnterior;

    cargarNuevasPreguntas();

    if (inicioAnterior === 0) {
        document.querySelector('button[onclick="retrocederPreguntas()"]').disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarPreguntasDesdeLocalStorage();
    cargarNuevasPreguntas();
});




function editar() {
    document.querySelector('button[onclick="retrocederPreguntas()"]').disabled = false;
    const preguntasContainer = document.getElementById('preguntasContainer');
    preguntasContainer.innerHTML = ''; 

    const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; 
    const fin = Math.min(indiceActual - 3 + preguntasPorGrupo, preguntas.length);
    for (let i = indiceActual - 3; i < fin; i++) {
        const pregunta = preguntas[i];
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta-cf';
        let opcionesHTML = '';
        pregunta.opciones.forEach((opcion, idx) => {
            opcionesHTML += `
                <label>
                    <input type="text" id="opcion${i + 1}${letras[idx]}" value="${opcion}">
                </label>
            `;
        });
        preguntaDiv.innerHTML = `
            <p>${i + 1}. <input type="text" id="enunciado${i + 1}" value="${pregunta.enunciado}"></p>
            <button onclick="agregarEspacio(${i + 1})">Añadir espacio</button>
            <div class="opciones-cf">
                ${pregunta.opciones.map((opcion, idx) => `
                    <label>
                        <input type="radio" name="respuesta${i + 1}" value="${letras[idx]}" ${pregunta.respuestaCorrecta === letras[idx] ? 'checked' : ''}>
                        <input type="text" class="opcion-input" value="${opcion}">
                    </label>
                `).join('')}
            </div>
        `;
        preguntasContainer.appendChild(preguntaDiv);
    }

    document.getElementById('botonGuardar').style.display = 'inline-block';
    document.getElementById('botonEditar').style.display = 'none';
    indiceActual = fin; 
    if (indiceActual >= preguntas.length) {
        document.querySelector('button[onclick="cargarNuevasPreguntas()"]').disabled = true; 
    }
    document.getElementById('atras').style.display = 'none';
    document.getElementById('sig').style.display = 'none';
    document.getElementById('veri').style.display = 'none';
}




function agregarEspacio(indicePregunta) {
    const enunciadoInput = document.getElementById(`enunciado${indicePregunta}`);
    enunciadoInput.value += '_ _ _ _ _ _';
}

function guardarCambios() {
    
    const preguntasContainer = document.getElementById('preguntasContainer');

    preguntasContainer.querySelectorAll('.pregunta-cf').forEach((preguntaDiv, index) => {
        const enunciadoInput = preguntaDiv.querySelector(`#enunciado${indiceActual-3 + index + 1}`);
        const opcionesInputs = preguntaDiv.querySelectorAll(`.opcion-input`);

        preguntas[indiceActual-3 + index].enunciado = enunciadoInput.value;
        preguntas[indiceActual-3 + index].opciones = Array.from(opcionesInputs).map(input => input.value);

        const respuestaCorrectaInput = preguntaDiv.querySelector(`input[name="respuesta${indiceActual-3 + index + 1}"]:checked`);
        preguntas[indiceActual-3 + index].respuestaCorrecta = respuestaCorrectaInput ? respuestaCorrectaInput.value : null;
    });

    localStorage.setItem('preguntas', JSON.stringify(preguntas));

    document.getElementById('botonEditar').style.display = 'inline-block';
    document.getElementById('botonGuardar').style.display = 'none';

    indiceActual = indiceActual -3;
    cargarNuevasPreguntas();
    document.getElementById('atras').style.display = 'inline-block';
    document.getElementById('sig').style.display = 'inline-block';
    document.getElementById('veri').style.display = 'inline-block';
}

document.addEventListener('DOMContentLoaded', cargarPreguntasDesdeLocalStorage);
