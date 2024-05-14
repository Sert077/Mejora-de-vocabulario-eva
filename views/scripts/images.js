function mostrarImagen() {
    var imagen = document.getElementById('imagen');
    imagen.src = imagenes[imagenIndex].src;
    document.getElementById('pregunta').innerText = imagenes[imagenIndex].pregunta;

    // Aplicar animación de derecha a izquierda
    imagen.classList.add('mover-derecha-izquierda');
    // Remover la clase después de un tiempo para poder repetir la animación
    setTimeout(function() {
        imagen.classList.remove('mover-derecha-izquierda');
    }, 5000); // Ajusta el tiempo según la duración de tu animación
}
