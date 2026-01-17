<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Allow local + deployed frontends
// ✅ Centralized CORS
require_once __DIR__ . '/../utils/cors.php';
handleCors();

header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../classes/User.php';
require_once __DIR__ . '/../utils/csrf.php';

$data = json_decode(file_get_contents("php://input"));

// Try to get CSRF from body OR header
$headers = getallheaders();
error_log("📥 Register Request Headers: " . json_encode($headers));
error_log("ℹ️ Register Session ID: " . session_id() . ", Session CSRF: " . ($_SESSION['csrf_token'] ?? 'NULL'));

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
