<?php
require __DIR__ . '/../vendor/autoload.php';

class DB {
    public function connect() {
        $client = new MongoDB\Client("mongodb://localhost:27017");
        return $client->farmerAppDB; // your DB name here
    }
}
