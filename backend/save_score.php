<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if ($data) {
    $name     = $data["playerName"] ?? "Anonymous";
    $score    = (int)($data["score"] ?? 0);
    $accuracy = (float)($data["accuracy"] ?? 0);
    $avg_time = (float)($data["avgTime"] ?? 0);
    $room_id  = $data["roomId"] ?? "Global";

    // 1. LOGIKA CEK DUPLIKAT (Si Satpam)
    $checkStmt = $conn->prepare("SELECT id FROM leaderboard WHERE player_name = ? AND room_id = ?");
    $checkStmt->bind_param("ss", $name, $room_id);
    $checkStmt->execute();
    $checkStmt->store_result();
    
    // Jika sudah ada data, jangan INSERT lagi
    if ($checkStmt->num_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Legend already recorded!"]);
        $checkStmt->close();
        $conn->close();
        exit(); // STOP DISINI
    }
    $checkStmt->close();

    // 2. LOGIKA INSERT (Hanya jalan kalau belum ada data)
    // Kamu tadi lupa baris prepare INSERT ini:
    $stmt = $conn->prepare("INSERT INTO leaderboard (player_name, score, accuracy, avg_time, room_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sidds", $name, $score, $accuracy, $avg_time, $room_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Score Saved!"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No data provided"]);
}

$conn->close();
?>