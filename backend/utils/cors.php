<?php
function handleCors() {
    // List of allowed origins
    $allowed_origins = [
        "http://localhost:3000",
        "https://pravinraj023-project-74e2a1.gitlab.io",
        "https://pravinraj023-group.gitlab.io"
    ];

    // Add Env Var Origin (For Render)
    $envOrigin = getenv('ALLOWED_ORIGIN'); // e.g., https://my-app.onrender.com
    if ($envOrigin) {
        $allowed_origins[] = $envOrigin;
        // Strip trailing slash if present to match HTTP_ORIGIN
        $allowed_origins[] = rtrim($envOrigin, '/');
    }

    // Check if Origin matches
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = $_SERVER['HTTP_ORIGIN'];
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: " . $origin);
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        }
    } else {
        // Fallback for tools/Postman if needed, 
        // OR allow * if NOT using credentials? 
        // For now, let's strictly allow origins or default to localhost for dev
        // header("Access-Control-Allow-Origin: *"); 
    }

    // Handle Preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
