const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

// Ruta para la vista HTML del cuestionario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cuestionario.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
