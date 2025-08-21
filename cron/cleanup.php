<?php
require __DIR__ . '/../backend/vendor/autoload.php';
require __DIR__ . '/../backend/config/db.php';

$db = new DB();
$conn = $db->connect();
$collection = $conn->selectCollection('products');

// Mark products older than 30 days as inactive
$threshold = (new DateTime('-30 days'))->getTimestamp() * 1000;
$result = $collection->updateMany(
    ['createdAt' => ['$lt' => new MongoDB\BSON\UTCDateTime($threshold)]],
    ['$set' => ['active' => false]]
);

echo "Deactivated " . $result->getModifiedCount() . " old products.\n";
