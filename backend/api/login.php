<?php
// ✅ Add CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(200);
    exit();
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// ✅ Includes
require_once '../config/db.php';
require_once '../classes/User.php';

// ✅ Decode input
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit;
}

// ✅ MongoDB connect
$db = new DB();
$conn = $db->connect();

$user = new User($conn);
$user->email = $data->email;
$user->password = $data->password;

// ✅ Login logic
if ($user->login()) {
    echo json_encode([
        "success" => true,
        "userId" => $user->id,
        "role" => $user->role,
        "name" => $user->name,
        "email" => $user->email
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
