<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "entornos";

/// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT * FROM imagenes";
$result = $conn->query($sql);

$imagenes = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $imagenes[] = $row;
    }
} else {
    echo json_encode(array("message" => "No hay imágenes disponibles."));
}

$conn->close();

echo json_encode($imagenes);
?>