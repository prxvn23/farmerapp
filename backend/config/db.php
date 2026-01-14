<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

class DB {
    private $conn;

    public function connect() {
        // Load .env
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
        $dotenv->load();

        $uri = getenv('MONGO_URI') ?: "mongodb://localhost:27017";
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
