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
        // Hosts resolved via local DNS: ac-zz2vpgm-shard-00-xx.talcjux.mongodb.net
        // Password '@' encoded as '%40'
        $user = "pravinjordan023";
        $pass = "Ravipriya%40023"; // URL Encoded '@'
        
        $uri = "mongodb://{$user}:{$pass}@ac-zz2vpgm-shard-00-00.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-01.talcjux.mongodb.net:27017,ac-zz2vpgm-shard-00-02.talcjux.mongodb.net:27017/farmerDB?ssl=true&replicaSet=atlas-zz2vpgm-shard-0&authSource=admin&retryWrites=true&w=majority";
        $dbName = getenv('MONGO_DB') ?: "farmerDB";

        try {
            $client = new Client($uri);
            $this->conn = $client->selectDatabase($dbName);
            return $this->conn;
        } catch (Exception $e) {
            die("❌ MongoDB Connection Error: " . $e->getMessage());
        }
    }
}
