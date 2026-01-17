<?php
require_once __DIR__ . '/vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;

echo "Checking Builder...\n";

try {
    if (!class_exists(Builder::class)) {
        echo "❌ Builder class not found!\n";
        exit(1);
    }
    echo "✅ Builder class exists.\n";
    
    $ref = new ReflectionClass(Builder::class);
    echo "Methods:\n";
    foreach ($ref->getMethods() as $m) {
        echo "- " . $m->getName() . "\n";
    }

    echo "Constructor Param Names:\n";
    if ($ref->getConstructor()) {
        foreach ($ref->getConstructor()->getParameters() as $p) {
            echo "- " . $p->getName() . "\n";
        }
    }

} catch (Throwable $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
