<?php
// ✅ Centralized CORS
require_once __DIR__ . '/../../utils/cors.php';
handleCors();
header("Content-Type: application/json");

// ✅ Includes
require_once '../../config/db.php';
require_once '../../classes/Product.php';
require_once '../../vendor/autoload.php'; // If using MongoDB via Composer

// ✅ Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

// ✅ Fetch data from form-data
$name = $_POST['name'] ?? '';
$price = $_POST['price'] ?? '';
$quantity = $_POST['quantity'] ?? '';
$farmerId = $_POST['farmerId'] ?? '';
$farmerName = $_POST['farmerName'] ?? '';
$contact = $_POST['contact'] ?? '';
$upi = $_POST['upi'] ?? '';
$imageFile = $_FILES['image'] ?? null;

// ✅ Validation check
if (!$name || !$price || !$quantity || !$farmerId) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// ✅ Upload image if exists
$imageName = '';
if ($imageFile && $imageFile['tmp_name']) {
    $ext = pathinfo($imageFile['name'], PATHINFO_EXTENSION);
    $imageName = uniqid() . '.' . $ext;

    // ✅ Save to /uploads folder
    $uploadDir = '../../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    move_uploaded_file($imageFile['tmp_name'], $uploadDir . $imageName);
}

// ✅ Connect to MongoDB
$db = new DB();
$conn = $db->connect();
$product = new Product($conn);

// ✅ Assign data
$product->name = $name;
$product->price = $price;
$product->quantity = $quantity;
$product->farmerId = $farmerId;
$product->farmerName = $farmerName;
$product->contact = $contact;
$product->upi = $upi;
$product->image = $imageName;

// ✅ Save to DB
if ($product->add()) {
    echo json_encode(["success" => true, "message" => "Product added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add product"]);
}
