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
        
        // DEBUG: Force Prod URI with RESOLVED HOSTS (Bypassing SRV/DNS & Special Char issues)
        // DEBUG: Force Prod URI with RESOLVED HOSTS
        // BACK TO BASICS: Legacy String with URL Encoded Password
        
        $user = "pravinjordan023";
        $pass = "Ravipriya%40023"; // Encoded @
        $hosts = "ac-zz2vpgm-shard-00-00.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-01.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-02.talcjux.mongodb.net:27017";
        $params = "farmerDB?ssl=true&replicaSet=atlas-zz2vpgm-shard-0&authSource=admin&retryWrites=true&w=majority";
        
        $uri = "mongodb://{$user}:{$pass}@{$hosts}/{$params}";

        error_log("🔌 Connecting to MongoDB URI: " . $uri);
        
        // Uncomment to see the URI in the browser response (Temporary Debug)
        // die(json_encode(["error" => "Debug URI", "uri" => $uri]));

        try {
            // No Options Array - Pure URI
            $client = new Client($uri);
            $this->conn = $client->selectDatabase("farmerDB");
            return $this->conn;
        } catch (Exception $e) {
            error_log("❌ MongoDB Connection Error: " . $e->getMessage());
            die(json_encode(["success" => false, "message" => "❌ DB Error: " . $e->getMessage()]));
        }
    }
}
