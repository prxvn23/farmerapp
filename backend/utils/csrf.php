<?php
// ✅ Configure session for Cross-Origin (Localhost Port 3000 -> 8000)
// For HTTP localhost, 'SameSite' => 'Lax' is best. 'None' requires 'Secure' (HTTPS).
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        error_log("🆕 Generated CSRF Token: " . $_SESSION['csrf_token'] . " for Session ID: " . session_id());
    }
    return $_SESSION['csrf_token'];
}

function validateCsrfToken($token) {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        error_log("❌ CSRF Fail: Token provided: " . json_encode($token) . ", Session token: " . json_encode($_SESSION['csrf_token'] ?? 'NULL') . ", Session ID: " . session_id());
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// ✅ Allow direct access to fetch token (Guarded to prevent output when included)
if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
    // CORS Headers for direct fetch
    // ✅ Centralized CORS
    require_once __DIR__ . '/cors.php';
    handleCors();
    header('Content-Type: application/json');
    echo json_encode(['csrf_token' => generateCsrfToken()]);
}

