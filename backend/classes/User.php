<?php
use MongoDB\BSON\ObjectId;

class User {
    public $conn;
    public $id;
    public $name;
    public $email;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    // ✅ Register a new user
    public function register() {
        $collection = $this->conn->selectCollection("users");

        // Check if email already exists
        $existing = $collection->findOne(["email" => $this->email]);
        if ($existing) {
            return false; // Email already exists
        }

        // Hash password
        $hashedPassword = password_hash($this->password, PASSWORD_DEFAULT);

        // Insert into database
        $insertResult = $collection->insertOne([
            "name" => $this->name,
            "email" => $this->email,
            "password" => $hashedPassword,
            "role" => $this->role
        ]);

        return $insertResult->getInsertedCount() > 0;
    }

    // ✅ Login existing user
   public function login() {
    $collection = $this->conn->selectCollection("users");
    $userData = $collection->findOne(["email" => $this->email]);

    if ($userData && password_verify($this->password, $userData['password'])) {
        $this->id = (string) $userData['_id'];
        $this->role = $userData['role'] ?? '';
        $this->name = $userData['name'] ?? '';
        return true;
    }
    return false;
}

}
