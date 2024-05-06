const preguntas = [
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

function cargarNuevasPreguntas() {
    const preguntasContainer = document.getElementById('preguntasContainer');
    preguntasContainer.innerHTML = ''; // Limpiar preguntas actuales antes de añadir nuevas

    const fin = Math.min(indiceActual + preguntasPorGrupo, preguntas.length);
    for (let i = indiceActual; i < fin; i++) {
        const pregunta = preguntas[i];
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta-cf';
        let opcionesHTML = '';
        pregunta.opciones.forEach((opcion, idx) => {
            const letra = ['a', 'b', 'c', 'd'][idx];
            opcionesHTML += `<label><input type="radio" name="opcion${i + 1}" value="${letra}"> ${letra}) ${opcion}</label>`;
        });
        preguntaDiv.innerHTML = `
            <p>${i + 1}. ${pregunta.enunciado}</p>
            <div class="opciones-cf">
                ${opcionesHTML}
            </div>
        `;
        preguntasContainer.appendChild(preguntaDiv);
    }
    indiceActual = fin; // Actualizamos el índice para la próxima carga
    if (indiceActual >= preguntas.length) {
        document.querySelector('button[onclick="cargarNuevasPreguntas()"]').disabled = true; // Deshabilitar botón si no hay más preguntas
    }
}

function verificarRespuestas() {
    let aciertos = 0;
    let resultadoTexto = "";

    for (let i = 0; i < preguntas.length; i++) {
        const respuestaSeleccionada = document.querySelector(`input[name="opcion${i + 1}"]:checked`) ? document.querySelector(`input[name="opcion${i + 1}"]:checked`).value : "";
        if (respuestaSeleccionada === preguntas[i].respuestaCorrecta) {
            aciertos++;
        }
    }

    if (aciertos === preguntas.length) {
        resultadoTexto = "¡Perfecto! Todas las respuestas son correctas.";
    } else {
        //resultadoTexto = `Has acertado ${aciertos} de ${preguntas.length} preguntas.`;
        resultadoTexto = `Has acertado ${aciertos} preguntas.`;
    }

    document.getElementById("resultado").textContent = resultadoTexto;
}

// Cargar las primeras tres preguntas al cargar la página
document.addEventListener('DOMContentLoaded', cargarNuevasPreguntas);