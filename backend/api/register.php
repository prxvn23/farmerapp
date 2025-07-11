<?php
// ✅ Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// ✅ Get input data
$data = json_decode(file_get_contents("php://input"));

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
