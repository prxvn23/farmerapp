<?php
require_once __DIR__ . '/vendor/autoload.php';

$uri = "mongodb+srv://pravinjordan023:Ravipriya_023@farmer-cluster.talcjux.mongodb.net/farmerDB?retryWrites=true&w=majority&appName=farmer-cluster";
$dbName = "farmerDB";


try {
    $client = new MongoDB\Client($uri);
    $db = $client->selectDatabase($dbName);
    $collection = $db->selectCollection("User");

    $result = $collection->insertOne([
        "name" => "Test User",
        "email" => "test@example.com",
        "password" => "dummy",
        "role" => "farmer",
        "created_at" => new \MongoDB\BSON\UTCDateTime()
    ]);

    echo "✅ Inserted ID: " . $result->getInsertedId();
} catch (Exception $e) {
    echo "❌ MongoDB Test Failed: " . $e->getMessage();
}
