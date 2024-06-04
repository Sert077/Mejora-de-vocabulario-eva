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
        console.error('Error conectando a la base de datos:', err.stack);
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
app.get('/obtener_imagenes', (req, res) => {
    const query = 'SELECT id, imagen, opcion1, opcion2, opcion3 FROM imagenes';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener datos:', err.stack);
            res.status(500).send('Error al obtener datos de la base de datos');
            return;
        }

        // Convertir blob a base64
        results.forEach(row => {
            row.imagen = row.imagen.toString('base64');
        });

        // Imágenes predeterminadas
        const imagenesPredeterminadas = [
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
                src: "Images/cebra.jpg", 
                pregunta: "¿Qué animal es el que se muestra en la imagen?", 
                respuesta: "cebra", 
                opciones: ["Aguila", "delfin", "cebra"]
            },
            { 
                src: "Images/jirafa.jpg", 
                pregunta: "¿Qué animal es el que se muestra en la imagen?", 
                respuesta: "jirafa",
                opciones: ["Aguila", "jirafa", "delfin"]
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
            },
            { 
                src: "Images/tiburon.jpg", 
                pregunta: "¿Qué animal es el que se muestra en la imagen?", 
                respuesta: "tiburon",
                opciones: ["Aguila", "delfin", "tiburon"]
            },
        ];

        // Combinar imágenes predeterminadas con las obtenidas de la base de datos
        const imagenesCompletas = imagenesPredeterminadas.concat(results.map(row => ({
            src: `data:image/jpeg;base64,${row.imagen}`,
            pregunta: "¿Qué animal es el que se muestra en la imagen?",
            respuesta: row.opcion3,
            opciones: [row.opcion1, row.opcion2, row.opcion3]
        })));

        res.json(imagenesCompletas);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
