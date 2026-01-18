<?php
// ✅ Centralized CORS
require_once __DIR__ . '/../../utils/cors.php';
handleCors();
header("Content-Type: application/json");

// ✅ Includes
require_once '../../config/db.php';
require_once '../../classes/Product.php';

// ✅ Connect DB
$db = new DB();
$conn = $db->connect();

// ✅ Fetch products
$product = new Product($conn);
$products = $product->getAll(); 

echo json_encode([
    "success" => true,
    "count" => count($products),
    "data" => $products
]);
