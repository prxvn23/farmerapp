<?php
// ✅ Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    http_response_code(200);
    exit();
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

require_once '../../config/db.php';
require_once '../../classes/Product.php';

// ✅ Check query param
if (!isset($_GET['farmerId'])) {
    echo json_encode(["success" => false, "message" => "Missing farmerId"]);
    exit;
}

$db = new DB();
$conn = $db->connect();

$product = new Product($conn);
$products = $product->getByFarmer($_GET['farmerId']);

echo json_encode($products);
