<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;

// ... (Headers and Input Parsing remain same) ...

// ✅ Centralized CORS
require_once __DIR__ . '/../utils/cors.php';
handleCors();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['upi']) || !isset($data['amount'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing UPI ID or Amount"]);
    exit;
}

$upi = $data['upi'];
$amount = $data['amount'];
$name = "FarmerApp Payment"; 

// UPI URL Format
$upiString = "upi://pay?pa={$upi}&pn={$name}&am={$amount}&cu=INR";

try {
    $builder = new Builder(
        writer: new PngWriter(),
        writerOptions: [],
        validateResult: false,
        data: $upiString,
        encoding: new Encoding('UTF-8'),
        errorCorrectionLevel: ErrorCorrectionLevel::Low,
        size: 300,
        margin: 10,
        roundBlockSizeMode: \Endroid\QrCode\RoundBlockSizeMode::Margin
    );
    
    $result = $builder->build();

    header('Content-Type: ' . $result->getMimeType());
    echo $result->getString();

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["error" => "QR Generation Error: " . $e->getMessage()]);
}
