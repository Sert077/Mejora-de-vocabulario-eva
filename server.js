const express = require('express');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'entornos'
});

// Conectar a la base de datos
connection.connect(err => {
    if (err) {
        //console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Middleware para parsear el body de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

// Ruta para la vista HTML del cuestionario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cuestionario.html'));
});

// Ruta para procesar el formulario
app.post('/procesar_formulario2.php', upload.single('imagen'), (req, res) => {
    const { opcion1, opcion2, opcion3 } = req.body;
    const imagen = req.file.buffer;

    // Consulta para insertar los datos en la base de datos
    const query = 'INSERT INTO imagenes (imagen, opcion1, opcion2, opcion3) VALUES (?, ?, ?, ?)';
    connection.query(query, [imagen, opcion1, opcion2, opcion3], (err, results) => {
        if (err) {
            console.error('Error al insertar datos:', err.stack);
            res.status(500).send('Error al insertar datos en la base de datos');
            return;
        }

        res.redirect('/seleccion_multiple.html');
    });
});

// Ruta para obtener los datos de las imágenes desde la base de datos


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});