function verificarRespuestas() {
    // Array con las respuestas correctas
    const respuestasCorrectas = ['c', 'a', 'c']; // Cambia esto con las respuestas correctas de tus preguntas
    
    // Array para almacenar las respuestas del usuario
    const respuestasUsuario = [];
    
    // Obtener las respuestas seleccionadas por el usuario y almacenarlas en el array respuestasUsuario
    for (let i = 1; i <= respuestasCorrectas.length; i++) {
        const opcionSeleccionada = document.querySelector(`input[name="opcion${i}"]:checked`);
        if (opcionSeleccionada) {
            respuestasUsuario.push(opcionSeleccionada.value);
        } else {
            // Si el usuario no ha seleccionado una opción para todas las preguntas, mostrar un mensaje de error
            mostrarResultado('Debes responder todas las preguntas.');
            return;
        }
    }
    
    // Verificar las respuestas del usuario
    let correctas = 0;
    for (let i = 0; i < respuestasCorrectas.length; i++) {
        if (respuestasUsuario[i] === respuestasCorrectas[i]) {
            correctas++;
        }
    }
    
    // Mostrar el resultado
    mostrarResultado(`Has respondido correctamente ${correctas} de ${respuestasCorrectas.length} preguntas.`);
}

function mostrarResultado(mensaje) {
    const resultado = document.getElementById('resultado');
    resultado.textContent = mensaje;
}
