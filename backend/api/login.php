<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Start output buffering immediately to catch any include/require noise
ob_start();

// Allow local + deployed frontends
// ✅ Centralized CORS
require_once __DIR__ . '/../utils/cors.php';
handleCors();

header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../classes/User.php';
require_once __DIR__ . '/../utils/csrf.php';

// Parse JSON body
$data = json_decode(file_get_contents("php://input"));

// Start output buffering to catch any stray warnings/errors
// ob_start(); // Moved to top

try {
    // Try to get CSRF from header or body
    $headers = getallheaders();
    $csrfToken = $headers['X-CSRF-Token'] ?? ($headers['x-csrf-token'] ?? ($data->csrf_token ?? null));

    error_log("📥 Login Request Headers: " . json_encode($headers));
    error_log("ℹ️ Login Session ID: " . session_id() . ", Session CSRF: " . ($_SESSION['csrf_token'] ?? 'NULL') . ", Received CSRF: " . ($csrfToken ?? 'NULL'));

    // Validate required fields
    if (!$data || empty($data->email) || empty($data->password) || !$csrfToken) {
        throw new Exception("❌ Missing fields (Email, Password, or CSRF Token)");
    }

    // Validate CSRF
    if (!validateCsrfToken($csrfToken)) {
        throw new Exception("❌ Invalid CSRF token");
    }

    $db = new DB();
    $conn = $db->connect();

    $user = new User($conn);
    $user->email = $data->email;
    $user->password = $data->password;

    if ($user->login()) {
        $response = [
            "success" => true,
            "user" => [
                "id" => $user->id,
                "role" => $user->role,
                "name" => $user->name,
                "email" => $user->email
            ],
            "message" => "✅ Login successful"
        ];
    } else {
        throw new Exception("❌ Invalid credentials");
    }

} catch (Exception $e) {
    $response = ["success" => false, "message" => $e->getMessage()];
}

// Clear any buffered output (like warnings) and send JSON
ob_end_clean();
echo json_encode($response);
