<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "entornos"; // Reemplaza "nombre_de_tu_base_de_datos" con el nombre de tu base de datos

// Crea una conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verifica la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
