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

$data = json_decode(file_get_contents("php://input"));

// Try to get CSRF from body OR header
$headers = getallheaders();
$csrfToken = $data->csrf_token ?? ($headers['X-CSRF-Token'] ?? null);

// Validate CSRF
if (!validateCsrfToken($csrfToken)) {
    echo json_encode(["success" => false, "message" => "❌ Invalid CSRF token"]);
    exit;
}

// Validate required fields
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

$db = new DB();
$conn = $db->connect();

$user = new User($conn);
$user->name = htmlspecialchars(strip_tags($data->name));
$user->email = htmlspecialchars(strip_tags($data->email));
$user->password = $data->password; 
$user->role = htmlspecialchars(strip_tags($data->role));

if ($user->register()) {
    // 🐰 RabbitMQ: Publish User Registered Event
    try {
        require_once __DIR__ . '/../classes/Queue.php';
        $queue = new Queue();
        $queue->publish('notifications', [
            'event' => 'USER_REGISTERED',
            'email' => $user->email,
            'name' => $user->name, // Log name too
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        // Log error but don't fail registration
        error_log("RabbitMQ Error: " . $e->getMessage());
    }

    echo json_encode(["success" => true, "message" => "✅ Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Registration failed"]);
}
