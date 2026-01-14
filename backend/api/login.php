<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Allow local + deployed frontends
$allowed_origins = [
    "http://localhost:3000",
    "https://pravinraj023-project-74e2a1.gitlab.io",
    "https://pravinraj023-group.gitlab.io"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../classes/User.php';
require_once __DIR__ . '/../utils/csrf.php';

// Parse JSON body
$data = json_decode(file_get_contents("php://input"));

// Try to get CSRF from header only
$headers = getallheaders();
$csrfToken = $headers['X-CSRF-Token'] ?? null;

// Validate required fields
if (!$data || empty($data->email) || empty($data->password) || !$csrfToken) {
    echo json_encode(["success" => false, "message" => "❌ Missing fields"]);
    exit;
}

// Validate CSRF
if (!validateCsrfToken($csrfToken)) {
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
        "user" => [
            "id" => $user->id,
            "role" => $user->role,
            "name" => $user->name,
            "email" => $user->email
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Invalid credentials"]);
}
