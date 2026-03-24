<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "db.php";

$sql = "SELECT player_name, score, accuracy, avg_time 
        FROM leaderboard 
        ORDER BY score DESC, accuracy DESC 
        LIMIT 10";

$result = mysqli_query($conn, $sql);
$leaderboard = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $leaderboard[] = $row;
    }
    echo json_encode($leaderboard);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
mysqli_close($conn);
?>