<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

class DB {
    private $conn;

    public function connect() {
        // Load .env
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
        $dotenv->load();

        // $uri = getenv('MONGO_URI') ?: "mongodb://localhost:27017";
        
        // Enable Error Reporting for Debugging
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        // DEBUG: Force Prod URI with RESOLVED HOSTS
        // BACK TO BASICS: Legacy String with URL Encoded Password
        
        $user = "pravinjordan023";
        $pass = "Ravipriya%40023"; // Encoded @
        $hosts = "ac-zz2vpgm-shard-00-00.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-01.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-02.talcjux.mongodb.net:27017";
        
        // REMOVED replicaSet (to avoid mismatch errors)
        // KEPT ssl=true (Required by Atlas)
        // KEPT authSource=admin (Required for User)
        $params = "farmerDB?ssl=true&authSource=admin&retryWrites=true&w=majority";
        
        $uri = "mongodb://{$user}:{$pass}@{$hosts}/{$params}";

        error_log("🔌 Connecting to MongoDB URI: " . $uri);
        
        try {
            // No Options Array - Pure URI
            $client = new Client($uri);
            $this->conn = $client->selectDatabase("farmerDB");
            
            // Force a command to verify connection immediately
            $this->conn->command(['ping' => 1]);
            
            return $this->conn;
        } catch (Exception $e) {
            error_log("❌ MongoDB Connection Error: " . $e->getMessage());
            // Return JSON immediately if connection fails
            header('Content-Type: application/json');
            echo json_encode(["success" => false, "message" => "❌ DB Connect Error: " . $e->getMessage()]);
            exit;
        }
    }
}
