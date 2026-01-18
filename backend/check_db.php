<?php
// Standalone DB Connection Test
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/vendor/autoload.php';

use MongoDB\Client;

header("Content-Type: text/plain");

echo "Attempting MongoDB Connection...\n";

// 1. Define Credentials
$user = "pravinjordan023";
$pass = "Ravipriya%40023"; // Encoded @
$hosts = "ac-zz2vpgm-shard-00-00.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-01.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-02.talcjux.mongodb.net:27017";
$dbName = "farmerDB";

// 2. Different Auth Strategies
$strategies = [
    "Legacy URI (Encoded Pass)" => [
        "uri" => "mongodb://{$user}:{$pass}@{$hosts}/{$dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority",
        "options" => []
    ],
    "Options Array (Raw Pass)" => [
        "uri" => "mongodb://{$hosts}/{$dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority",
        "options" => [
            "username" => "pravinjordan023",
            "password" => "Ravipriya@023", // Raw Password
        ]
    ],
    "Direct Admin DB Path" => [
        "uri" => "mongodb://{$user}:{$pass}@{$hosts}/admin?ssl=true&retryWrites=true&w=majority", // Path is /admin
        "options" => []
    ]
];

foreach ($strategies as $label => $config) {
    echo "\n-------------------------------------------------\n";
    echo "Testing: $label\n";
    echo "URI: " . $config['uri'] . "\n";
    
    try {
        $client = new Client($config['uri'], $config['options']);
        $client->selectDatabase($dbName)->command(['ping' => 1]);
        echo "✅ SUCCESS! Connected via $label\n";
        exit;
    } catch (Exception $e) {
        echo "❌ FAILED: " . $e->getMessage() . "\n";
    }
}
echo "\n-------------------------------------------------\n";
echo "All attempts failed. Please double check Password and Permissions.\n";
