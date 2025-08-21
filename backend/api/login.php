<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ✅ CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: https://pravinraj023-project-74e2a1.gitlab.io");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(200);
    exit();
}
header("Access-Control-Allow-Origin: https://pravinraj023-project-74e2a1.gitlab.io");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../classes/User.php';
require_once __DIR__ . '/../utils/csrf.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email) || !isset($data->password) || !isset($data->csrf_token)) {
    echo json_encode(["success" => false, "message" => "❌ Missing fields"]);
    exit;
}

if (!validateCsrfToken($data->csrf_token)) {
    echo json_encode(["success" => false, "message" => "❌ Invalid CSRF token"]);
    exit;
}

$db = new DB();
$conn = $db->connect();

$user = new User($conn);
$user->email = $data->email;
$user->password = $data->password;

if ($user->login()) {
    echo json_encode([
        "success" => true,
        "userId" => $user->id,
        "role" => $user->role,
        "name" => $user->name,
        "email" => $user->email
    ]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Invalid credentials"]);
}
