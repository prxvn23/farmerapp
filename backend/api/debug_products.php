<?php
// backend/api/debug_products.php
require_once __DIR__ . '/../utils/cors.php';
handleCors();
header("Content-Type: application/json");

require_once '../config/db.php';
require_once '../vendor/autoload.php';

try {
    $db = new DB();
    $conn = $db->connect();
    $collection = $conn->selectCollection("products");
    
    // Find ALL documents
    $cursor = $collection->find([]);
    $results = [];
    
    foreach ($cursor as $doc) {
        // Convert BSON items to string for readable JSON
        $doc['_id'] = (string)$doc['_id'];
        $results[] = $doc;
    }
    
    echo json_encode([
        "success" => true,
        "count" => count($results),
        "data" => $results,
        "database_name" => $db->db_name // Expose which DB is being used
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
