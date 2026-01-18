<?php
use MongoDB\BSON\UTCDateTime;

class User {
    private $conn;
    private $collection;

    public $name;
    public $email;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
        $this->collection = $this->conn->selectCollection("User"); // 👈 collection name
    }

    public function register() {
        try {
            // ✅ check if email already exists
            $existingUser = $this->collection->findOne(["email" => $this->email]);
            if ($existingUser) {
                return false; // prevent duplicates
            }

            // ✅ hash password
            $hashedPassword = password_hash($this->password, PASSWORD_BCRYPT);

            // ✅ insert document
            $result = $this->collection->insertOne([
                "name" => $this->name,
                "email" => $this->email,
                "password" => $hashedPassword,
                "role" => $this->role,
                "created_at" => new UTCDateTime()
            ]);

            return $result->getInsertedCount() > 0;

        } catch (Exception $e) {
            error_log("❌ User Registration Error: " . $e->getMessage());
            return false;
        }
    }


    public function login() {
        // No Try-Catch needed here, let Exceptions bubble up to login.php
        $user = $this->collection->findOne(["email" => $this->email]);
        
        if (!$user) {
            throw new Exception("❌ Debug: User '$this->email' NOT FOUND in DB.");
        }

        if (password_verify($this->password, $user['password'])) {
            $this->id = (string)$user['_id'];
            $this->name = $user['name'];
            $this->role = $user['role'];
            return true;
        } else {
            throw new Exception("❌ Debug: Password verification failed.");
        }
    }
}
