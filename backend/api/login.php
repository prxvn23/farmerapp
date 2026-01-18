<?php
// ✅ Centralized CORS
require_once __DIR__ . '/../utils/cors.php';
handleCors();

// ✅ CSRF & Session Init (Must be before output)
require_once __DIR__ . '/../utils/csrf.php';

header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../classes/User.php';

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
    // Validate required fields
    if (!$data) throw new Exception("❌ No JSON data received");
    if (empty($data->email)) throw new Exception("❌ Missing Email");
    if (empty($data->password)) throw new Exception("❌ Missing Password");
    if (!$csrfToken) {
         throw new Exception("❌ Missing CSRF Token. Headers: " . json_encode($headers));
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
