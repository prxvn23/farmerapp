<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../classes/Queue.php';
require __DIR__ . '/../config/db.php';

$queue = new Queue();
$db = new DB();
$conn = $db->connect();

// Example consumer: log events to a collection 'eventLogs'
$queue->consume('events', function($event) use ($conn) {
    $conn->selectCollection('eventLogs')->insertOne([
        'event' => $event,
        'receivedAt' => new MongoDB\BSON\UTCDateTime(),
    ]);
});
