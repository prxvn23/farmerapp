<?php
require __DIR__ . '/vendor/autoload.php';

try {
    // Force using the local container
    $client = new MongoDB\Client("mongodb://mongodb:27017");
    $db = $client->selectDatabase("farmerDB");
    $coll = $db->selectCollection("test_connection");
    $result = $coll->insertOne(["status" => "ok", "time" => time()]);
    
    echo "Inserted ID: " . $result->getInsertedId() . "\n";

    // Test RabbitMQ
    require_once __DIR__ . '/classes/Queue.php';
    $q = new Queue();
    $q->publish('test_queue', ['status' => 'ok']);
    echo "✅ SUCCESS: Connected to RabbitMQ and published message.\n";

} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}
