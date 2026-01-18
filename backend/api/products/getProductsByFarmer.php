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

$farmerId = $_GET['farmerId'];
error_log("🔍 Fetching products for Farmer ID: " . $farmerId);

$db = new DB();
$conn = $db->connect();

$product = new Product($conn);
$products = $product->getByFarmer($farmerId);

error_log("✅ Found " . count($products) . " products for Farmer ID: " . $farmerId);

echo json_encode($products);
