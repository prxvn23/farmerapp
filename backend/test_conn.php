<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h2>🔍 Diagnostics Tool</h2>";

// 1. Check Autoload
echo "Test 1: Vendor Autoload... ";
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
    echo "✅ OK<br>";
} else {
    die("❌ FAILED: vendor/autoload.php not found. Did you run composer install?");
}

// 2. Check .env
echo "Test 2: Loading .env... ";
try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    echo "✅ OK<br>";
} catch (Exception $e) {
    echo "❌ FAILED: " . $e->getMessage() . "<br>";
}

// 3. Check MongoDB
echo "Test 3: Connecting to MongoDB (via Class)... ";
try {
    require_once __DIR__ . '/config/db.php';
    $db = new DB();
    $conn = $db->connect();
    echo "✅ Connected to: " . $conn->getDatabaseName() . "<br>";
} catch (Throwable $e) {
    echo "❌ FAILED: " . $e->getMessage() . "<br>";
}

// 4. Check RabbitMQ
echo "Test 4: Connecting to RabbitMQ (via Class)... ";
try {
    require_once __DIR__ . '/classes/Queue.php';
    $queue = new Queue();
    echo "✅ Connection established (channel created)<br>";
} catch (Throwable $e) {
    echo "❌ FAILED (Expected if no local RabbitMQ): " . $e->getMessage() . "<br>";
    echo "<i>(This is acceptable if you don't need notifications)</i><br>";
}
