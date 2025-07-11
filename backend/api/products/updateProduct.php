<?php
// ✅ CORS Headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: PUT, OPTIONS");
    http_response_code(200);
    exit();
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Content-Type: application/json");

// ✅ Includes
require_once '../../config/db.php';
require_once '../../classes/Product.php';
require_once '../../vendor/autoload.php'; // MongoDB driver

// ✅ Get ID from URL
$uri = explode('/', $_SERVER['REQUEST_URI']);
$productId = end($uri);

// ✅ Validate ID
if (!$productId) {
    echo json_encode(["success" => false, "message" => "Missing product ID"]);
    exit;
}

// ✅ Read input JSON
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->price)) {
    echo json_encode(["success" => false, "message" => "Missing new price"]);
    exit;
}

// ✅ DB Connect
$db = new DB();
$conn = $db->connect();
$product = new Product($conn);

// ✅ Call update function
if ($product->updatePrice($productId, $data->price)) {
    echo json_encode(["success" => true, "message" => "Product price updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
