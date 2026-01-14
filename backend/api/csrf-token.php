<?php
require_once __DIR__ . '/../utils/csrf.php';

// Allowed frontend origins
$allowed_origins = [
    "http://localhost:3000",
    "https://pravinraj023-project-74e2a1.gitlab.io",
    "https://pravinraj023-group.gitlab.io"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

echo json_encode([
    "success" => true,
    "csrf_token" => generateCsrfToken()
]);

