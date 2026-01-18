<?php
// backend/api/check_qr_deps.php
require_once __DIR__ . '/../utils/cors.php';
handleCors();
header("Content-Type: application/json");

$results = [
    "gd_extension" => extension_loaded('gd'),
    "gd_info" => extension_loaded('gd') ? gd_info() : null,
    "vendor_autoload" => file_exists(__DIR__ . '/../vendor/autoload.php'),
    "qr_class_exists" => false,
    "error" => null
];

if ($results["vendor_autoload"]) {
    require_once __DIR__ . '/../vendor/autoload.php';
    if (class_exists('Endroid\QrCode\Builder\Builder')) {
        $results["qr_class_exists"] = true;
    }
}

echo json_encode($results);
