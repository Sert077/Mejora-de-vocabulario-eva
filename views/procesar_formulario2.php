<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "entornos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Directorio donde se guardarán las imágenes subidas
$target_dir = "uploads/";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $opcion1 = $_POST['opcion1'];
    $opcion2 = $_POST['opcion2'];
    $opcion3 = $_POST['opcion3'];
    $imagen = $_FILES['imagen'];

    // Nombre del archivo a guardar
    $target_file = $target_dir . basename($imagen["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Verificar si el archivo es una imagen real
    $check = getimagesize($imagen["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        echo "El archivo no es una imagen.";
        $uploadOk = 0;
    }

    // Verificar si el archivo ya existe
    if (file_exists($target_file)) {
        echo "Lo siento, el archivo ya existe.";
        $uploadOk = 0;
    }

    // Limitar el tamaño del archivo (5MB)
    if ($imagen["size"] > 5000000) {
        echo "Lo siento, el archivo es demasiado grande.";
        $uploadOk = 0;
    }

    // Permitir solo ciertos formatos de archivo
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        echo "Lo siento, solo se permiten archivos JPG, JPEG, PNG y GIF.";
        $uploadOk = 0;
    }

    // Verificar si $uploadOk es 0 debido a un error
    if ($uploadOk == 0) {
        echo "Lo siento, tu archivo no fue subido.";
    } else {
        if (move_uploaded_file($imagen["tmp_name"], $target_file)) {
            // Insertar los datos en la base de datos
            $sql = "INSERT INTO imagenes (imagen_path, opcion1, opcion2, opcion3) VALUES ('$target_file', '$opcion1', '$opcion2', '$opcion3')";
            if ($conn->query($sql) === TRUE) {
                echo "El archivo " . basename($imagen["name"]) . " ha sido subido correctamente.";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else {
            echo "Lo siento, hubo un error al subir tu archivo.";
        }
    }
}

$conn->close();
?>
