// ✅ Centralized CORS
require_once __DIR__ . '/../../utils/cors.php';
handleCors();
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
