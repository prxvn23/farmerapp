<?php
require_once __DIR__ . '/../utils/cors.php';
handleCors();
header("Content-Type: application/json");

$uploadDir = __DIR__ . '/../../uploads/';
$results = [
    "dir_exists" => is_dir($uploadDir),
    "is_writable" => is_writable($uploadDir),
    "files" => []
];

if (is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $results["files"][] = [
                "name" => $file,
                "size" => filesize($uploadDir . $file),
                "perms" => substr(sprintf('%o', fileperms($uploadDir . $file)), -4)
            ];
        }
    }
}

echo json_encode($results, JSON_PRETTY_PRINT);
