<?php
// Simple script to dump all users from the DB
require_once __DIR__ . '/config/db.php';

// Force JSON response
header('Content-Type: application/json');

try {
    $db = new DB();
    $conn = $db->connect();
    $collection = $conn->selectCollection("User");

    $users = $collection->find([]);
    $result = [];
    foreach ($users as $user) {
        $result[] = [
            'id' => (string)$user['_id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            // Don't expose full hash, just length to verify it's there
            'password_hash_len' => strlen($user['password'])
        ];
    }
    echo json_encode(['count' => count($result), 'users' => $result], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
