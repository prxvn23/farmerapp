<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../classes/Queue.php';
require __DIR__ . '/../config/db.php';

$queue = new Queue();
$db = new DB();
$conn = $db->connect();

// Example consumer: log events to a collection 'eventLogs'
// Consume from 'notifications' queue
$queue->consume('notifications', function($data) use ($conn) {
    echo " [x] Received event: " . json_encode($data) . "\n";
    
    // Log to MongoDB
    $conn->selectCollection('eventLogs')->insertOne([
        'data' => $data,
        'processedAt' => new MongoDB\BSON\UTCDateTime(),
    ]);
});
