<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Regular CORS headers for actual requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// ✅ Include required files
require_once '../config/db.php';
require_once '../classes/User.php';
require_once '../utils/csrf.php'; // ✅ include CSRF utility

// ✅ Get input data
$data = json_decode(file_get_contents("php://input"));

// ✅ Validate CSRF token
if (!isset($data->csrf_token) || $data->csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode(["success" => false, "message" => "❌ Invalid CSRF token"]);
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
    echo json_encode(["success" => false, "message" => "❌ Missing required fields"]);
    exit;
}

// ✅ DB connection
$db = new DB();
$conn = $db->connect();

// ✅ Set user properties
$user = new User($conn);
$user->name = $data->name;
$user->email = $data->email;
$user->password = $data->password;
$user->role = $data->role;

// ✅ Register user
if ($user->register()) {
    echo json_encode(["success" => true, "message" => "✅ Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Register failed (maybe email already exists)"]);
}
