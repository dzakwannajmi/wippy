<?php
require 'db.php'; 

try {
    if (!$conn) {
        throw new Exception("Koneksi tidak ditemukan. Cek variabel di db.php");
    }

    $result = mysqli_query($conn, "SELECT VERSION() as version");
    $row = mysqli_fetch_assoc($result);
    
    echo "\n------------------------------------------\n";
    echo "✅ KONEKSI BERHASIL!\n";
    echo "Versi MySQL: " . $row['version'] . "\n";
    echo "Database: " . $_ENV['DB_NAME'] . "\n";
    echo "------------------------------------------\n\n";

} catch (Exception $e) {
    echo "\n------------------------------------------\n";
    echo "❌ KONEKSI GAGAL!\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "------------------------------------------\n\n";
}
?>