<?php
// 🔹 Allow only your frontend domain
header("Access-Control-Allow-Origin: https://pravinraj023-group.gitlab.io");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// 🔹 Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Include required files
require_once '../config/db.php';
require_once '../classes/User.php';
require_once '../utils/csrf.php'; // ✅ include CSRF utility

// ✅ Get input data (JSON)
$data = json_decode(file_get_contents("php://input"));

// ✅ Validate CSRF token
session_start();
if (!isset($data->csrf_token) || $data->csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Invalid CSRF token"
    ]);
    exit;
}

// ✅ Validate required fields
if (
    !$data || 
    empty($data->name) || 
    empty($data->email) || 
    empty($data->password) || 
    empty($data->role)
) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Missing required fields"
    ]);
    exit;
}

// ✅ DB connection
$db = new DB();
$conn = $db->connect();

// ✅ Set user properties
$user = new User($conn);
$user->name = htmlspecialchars(strip_tags($data->name));
$user->email = htmlspecialchars(strip_tags($data->email));
$user->password = password_hash($data->password, PASSWORD_BCRYPT); // ✅ hash password
$user->role = htmlspecialchars(strip_tags($data->role));

// ✅ Register user
if ($user->register()) {
    echo json_encode([
        "success" => true,
        "message" => "✅ Registration successful"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "❌ Registration failed (maybe email already exists)"
    ]);
}
