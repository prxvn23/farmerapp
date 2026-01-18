<?php
// ✅ Centralized CORS
require_once __DIR__ . '/../../utils/cors.php';
handleCors();
header("Content-Type: application/json");

require_once '../../config/db.php';
require_once '../../classes/Product.php';

// ✅ Check query param
if (!isset($_GET['farmerId'])) {
    error_log("❌ getProductsByFarmer: Missing farmerId");
    echo json_encode(["success" => false, "message" => "Missing farmerId"]);
    exit;
}

// ✅ Trim ID to remove invisible spaces
$farmerId = trim($_GET['farmerId']);

$db = new DB();
$conn = $db->connect();

$product = new Product($conn);
$products = $product->getByFarmer($farmerId);

// Return rich response for debugging
echo json_encode([
    "success" => true,
    "debug_received_id" => $farmerId,
    "debug_id_length" => strlen($farmerId),
    "count" => count($products),
    "data" => $products
]);
