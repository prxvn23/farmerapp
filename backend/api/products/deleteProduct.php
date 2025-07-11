<?php
// ✅ CORS Headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: DELETE, OPTIONS");
    http_response_code(200);
    exit();
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Content-Type: application/json");

// ✅ Includes
require_once '../../config/db.php';
require_once '../../classes/Product.php';
require_once '../../vendor/autoload.php'; // Ensure MongoDB driver is loaded

// ✅ Get ID from URL
$uri = explode('/', $_SERVER['REQUEST_URI']);
$productId = end($uri);

// ✅ Validate ID
if (!$productId) {
    echo json_encode(["success" => false, "message" => "Missing product ID"]);
    exit;
}

// ✅ DB Connect
$db = new DB();
$conn = $db->connect();
$product = new Product($conn);

// ✅ Delete logic
if ($product->delete($productId)) {
    echo json_encode(["success" => true, "message" => "Product deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Delete failed"]);
}
