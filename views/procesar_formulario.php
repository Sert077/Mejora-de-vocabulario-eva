<?php
// Verifica si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verifica si se ha seleccionado una imagen
    if ($_FILES["imagen"]["error"] == 0) {
        // Ruta donde se guardará la imagen
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($_FILES["imagen"]["name"]);

        // Mueve la imagen del directorio temporal al directorio deseado
        if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $target_file)) {
            echo "La imagen ". basename($_FILES["imagen"]["name"]). " ha sido subida correctamente.";
        } else {
            echo "Hubo un error al subir la imagen.";
        }

        // Obtiene las opciones del formulario
        $opcion1 = $_POST["opcion1"];
        $opcion2 = $_POST["opcion2"];
        $opcion3 = $_POST["opcion3"];
        include 'conexion.php';

        // Prepara la consulta SQL para insertar los datos en la tabla
        $sql = "INSERT INTO nombre_de_tu_tabla (imagen, opcion1, opcion2, opcion3) VALUES ('$target_file', '$opcion1', '$opcion2', '$opcion3')";

        // Ejecuta la consulta SQL
        if ($conn->query($sql) === TRUE) {
            echo "Los datos han sido guardados correctamente en la base de datos.";
        } else {
            echo "Error al guardar los datos en la base de datos: " . $conn->error;
        }

        // Cierra la conexión a la base de datos
        $conn->close();

    } else {
        echo "Debes seleccionar una imagen.";
    }
}
?>