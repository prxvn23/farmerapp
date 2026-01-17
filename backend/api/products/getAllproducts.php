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
$products = $product->getAll(); // 👈 Add this method below

echo json_encode($products);
