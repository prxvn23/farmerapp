<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../classes/Product.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["message" => "Product ID is required"]);
    exit;
}

$db = new DB();
$conn = $db->connect();

$product = new Product($conn);
$result = $product->findById($id);

if ($result) {
    echo json_encode($result);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Product not found"]);
}
