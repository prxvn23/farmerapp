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

// 2. Different Auth Sources to Test
$uris = [
    "AuthSource-Admin" => "mongodb://{$user}:{$pass}@{$hosts}/{$dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority",
    "AuthSource-FarmerDB" => "mongodb://{$user}:{$pass}@{$hosts}/{$dbName}?ssl=true&authSource=farmerDB&retryWrites=true&w=majority",
    "No-AuthSource" => "mongodb://{$user}:{$pass}@{$hosts}/{$dbName}?ssl=true&retryWrites=true&w=majority"
];

foreach ($uris as $label => $uri) {
    echo "\n-------------------------------------------------\n";
    echo "Testing: $label\n";
    // Mask password in output
    echo "URI: " . preg_replace('/(:)([^@]+)(@)/', '$1****$3', $uri) . "\n";
    
    try {
        $client = new Client($uri);
        $client->selectDatabase($dbName)->command(['ping' => 1]);
        echo "✅ SUCCESS! Connected via $label\n";
        exit; // Stop on first success
    } catch (Exception $e) {
        echo "❌ FAILED: " . $e->getMessage() . "\n";
    }
}
echo "\n-------------------------------------------------\n";
echo "All attempts failed. Please double check Password and Permissions.\n";
