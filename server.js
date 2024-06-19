const express = require('express');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql2');

const fs = require('fs-extra');

const archiver = require('archiver');



const app = express();
const PORT = 3000;

async function copyFiles() {
  try {
      // Rutas de los archivos de origen y destino
      const filesToCopy = [
          { src: path.join(__dirname, 'index.html'), dest: path.join(__dirname, 'public', 'index.html') },
          { src: path.join(__dirname, 'imsmanifest.xml'), dest: path.join(__dirname, 'public', 'imsmanifest.xml') },
          { src: path.join(__dirname, 'views', 'styles','index.css'), dest: path.join(__dirname, 'public', 'views','styles','index.css') }
      ];

      // Copiar cada archivo
      for (const file of filesToCopy) {
          await fs.copyFile(file.src, file.dest);
          console.log(`Archivo copiado de ${file.src} a ${file.dest}`);
      }

      console.log('Todos los archivos se copiaron con éxito');
  } catch (err) {
      console.error('Error al copiar archivos:', err);
  }
}


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

app.use(express.json({ limit: '50mb' }));

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

async function emptyFolder(folderPath) {
  try {
      const items = await fs.readdir(folderPath);

      for (const item of items) {
          const itemPath = path.join(folderPath, item);
          const stat = await fs.stat(itemPath);

          if (stat.isFile()) {
              await fs.unlink(itemPath);
              console.log(`Archivo eliminado: ${itemPath}`);
          } else if (stat.isDirectory()) {
              await emptyFolder(itemPath); // Vaciar la subcarpeta de manera recursiva
          }
      }

      console.log(`Carpeta vaciada: ${folderPath}`);
  } catch (err) {
      console.error(`Error al vaciar la carpeta ${folderPath}:`, err);
  }
}

async function emptyPublicFolder() {
  const foldersToEmpty = [
      
      path.join(__dirname, 'public', 'views'),
      path.join(__dirname, 'public', 'views', 'Images'),
      path.join(__dirname, 'public', 'views', 'Styles'),
      path.join(__dirname, 'public', 'views', 'scripts'),
      path.join(__dirname, 'public'),
  ];

  for (const folderPath of foldersToEmpty) {
      await emptyFolder(folderPath);
  }
}


app.get('/download-zip', async (req, res) => {
  await copyFiles();
  const zipPath = path.join(__dirname, 'Paquete_SCORM.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
      zlib: { level: 9 } // Nivel de compresión
  });

  output.on('close', async () => {
      console.log(`${archive.pointer()} bytes totales`);
      console.log('Archivo ZIP ha sido finalizado y se ha cerrado el archivo de salida.');

      // Enviar el archivo ZIP al cliente
      res.download(zipPath, async (err) => {
          if (err) {
              console.error('Error al descargar el archivo ZIP:', err);
          } else {
              // Vaciar la carpeta public después de enviar el archivo ZIP
              await emptyPublicFolder();
              // Eliminar el archivo ZIP después de la descarga
              await fs.unlink(zipPath);
              console.log('Archivo ZIP eliminado después de la descarga');
          }
      });
  });

  archive.on('error', (err) => {
      throw err;
  });

  archive.pipe(output);

  archive.directory(path.join(__dirname, 'public'), false);

  await archive.finalize();
});






app.post('/save-files', (req, res) => {
  const { htmlContent, cssContent, jsContent } = req.body;

  // Guardar el archivo HTML
  fs.writeFile(path.join(__dirname, 'public','views', 'completar_frase.html'), htmlContent, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo HTML:', err);
      return res.status(500).send('Error al guardar el archivo HTML');
    }

    // Guardar el archivo CSS
    fs.writeFile(path.join(__dirname, 'public', 'views', 'styles', 'completar_frase.css'), cssContent, 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar el archivo CSS:', err);
        return res.status(500).send('Error al guardar el archivo CSS');
      }

      // Guardar el archivo JS
      fs.writeFile(path.join(__dirname, 'public', 'views', 'scripts', 'completar_frase.js'), jsContent, 'utf8', (err) => {
        if (err) {
          console.error('Error al guardar el archivo JS:', err);
          return res.status(500).send('Error al guardar el archivo JS');
        }

        res.send('Archivos guardados exitosamente');
      });
    });
  });
});

app.post('/save-files-Cuestionario', (req, res) => {
  const { htmlContent, cssContent, jsContent } = req.body;

  // Guardar el archivo HTML
  fs.writeFile(path.join(__dirname, 'public', 'views', 'cuestionario.html'), htmlContent, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo HTML:', err);
      return res.status(500).send('Error al guardar el archivo HTML');
    }

    // Guardar el archivo CSS
    fs.writeFile(path.join(__dirname, 'public', 'views', 'styles', 'estilos.css'), cssContent, 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar el archivo CSS:', err);
        return res.status(500).send('Error al guardar el archivo CSS');
      }

      // Guardar el archivo JS
      fs.writeFile(path.join(__dirname, 'public', 'views','scripts', 'javascript.js'), jsContent, 'utf8', (err) => {
        if (err) {
          console.error('Error al guardar el archivo JS:', err);
          return res.status(500).send('Error al guardar el archivo JS');
        }

        res.send('Archivos guardados exitosamente');
      });
    });
  });
});

app.post('/save-files-imagen', (req, res) => {
  const { htmlContent, cssContent, jsContent } = req.body;

  // Guardar el archivo HTML
  fs.writeFile(path.join(__dirname, 'public', 'views','seleccion_multiple.html'), htmlContent, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar el archivo HTML:', err);
      return res.status(500).send('Error al guardar el archivo HTML');
    }

    // Guardar el archivo CSS
    fs.writeFile(path.join(__dirname, 'public', 'views', 'styles', 'estilos.css'), cssContent, 'utf8', (err) => {
      if (err) {
        console.error('Error al guardar el archivo CSS:', err);
        return res.status(500).send('Error al guardar el archivo CSS');
      }

      // Guardar el archivo JS
      fs.writeFile(path.join(__dirname, 'public', 'views','scripts', 'seleccion_imagenes.js'), jsContent, 'utf8', (err) => {
        if (err) {
          console.error('Error al guardar el archivo JS:', err);
          return res.status(500).send('Error al guardar el archivo JS');
        }

        res.send('Archivos guardados exitosamente');
      });

      copyImagesFolder();
    });
  });
});

function copyImagesFolder() {
  const sourceDir = path.join(__dirname, 'views', 'Images');
  const destDir = path.join(__dirname, 'public', 'views','Images');

  // Verificar si la carpeta de destino existe, si no, crearla
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copiar la carpeta Images al directorio de destino usando fs-extra
  fs.copy(sourceDir, destDir, err => {
    if (err) {
      console.error('Error al copiar la carpeta Images:', err);
    } else {
      console.log('Carpeta Images copiada exitosamente');
    }
  });
}


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});