<?php

function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Panggil fungsi untuk memuat file .env
loadEnv(__DIR__ . '/.env');

// Ambil data dari $_ENV
$host = $_ENV['DB_HOST'];
$port = $_ENV['DB_PORT'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASSWORD'];
$db   = $_ENV['DB_NAME'];

// Koneksi menggunakan MySQLi
$conn = mysqli_connect($host, $user, $pass, $db, $port);

if (!$conn) {
    die("❌ Koneksi Gagal: " . mysqli_connect_error());
}
?>