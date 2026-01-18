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

    // ✅ Save to /uploads folder (Fixed path logic)
    $uploadDir = __DIR__ . '/../../uploads/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            error_log("❌ Failed to create upload directory: " . $uploadDir);
            echo json_encode(["success" => false, "message" => "Server error: Cannot create upload folder"]);
            exit;
        }
    }

    if (!move_uploaded_file($imageFile['tmp_name'], $uploadDir . $imageName)) {
        error_log("❌ Failed to move uploaded file to: " . $uploadDir . $imageName);
        echo json_encode(["success" => false, "message" => "Failed to upload image (Permission Denied?)"]);
        exit;
    }
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
error_log("📝 Adding Product: " . json_encode($product));

try {
    if ($product->add()) {
        error_log("✅ Product Added Successfully: " . $name);
        echo json_encode(["success" => true, "message" => "Product added successfully"]);
    }
} catch (Exception $e) {
    error_log("❌ Failed to Add Product: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Save Failed: " . $e->getMessage()]);
}
