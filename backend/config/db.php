<?php
require __DIR__ . '/../vendor/autoload.php';

class DB {
    private $uri;
    private $dbName;

    public function __construct() {
        $this->uri = getenv('MONGO_URI') ?: 'mongodb://mongodb:27017';
        $this->dbName = getenv('MONGO_DB') ?: 'farmerAppDB';
    }

    public function connect() {
        $client = new MongoDB\Client($this->uri);
        return $client->selectDatabase($this->dbName);
    }
}
