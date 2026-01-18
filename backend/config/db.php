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
        // Using Options Array for Auth to avoid Special Character (@) encoding issues
        
        $hosts = "ac-zz2vpgm-shard-00-00.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-01.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-02.talcjux.mongodb.net:27017";
        $params = "farmerDB?tls=true&authSource=admin&retryWrites=true&w=majority";
        
        // Pure URI without credentials
        $uri = "mongodb://{$hosts}/{$params}";

        // Raw Credentials in Options
        $options = [
            'username' => 'pravinjordan023',
            'password' => 'Ravipriya@023', // Raw Password
            'authSource' => 'admin', // Force Auth against Admin DB
        ];

        error_log("🔌 Connecting to MongoDB (Auth via Options)...");
        
        $dbName = getenv('MONGO_DB') ?: "farmerDB";

        try {
            // Pass options as second argument
            $client = new Client($uri, $options);
            $this->conn = $client->selectDatabase($dbName);
            return $this->conn;
        } catch (Exception $e) {
            error_log("❌ MongoDB Connection Error: " . $e->getMessage());
            die("❌ MongoDB Connection Error: " . $e->getMessage());
        }
    }
}
