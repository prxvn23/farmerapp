<?php
// Local test script to register a user
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/classes/User.php';
require_once __DIR__ . '/classes/Queue.php';

$db = new DB();
$conn = $db->connect();

$user = new User($conn);
$user->name = "Test Farmer";
$user->email = "test_" . time() . "@farmer.com";
$user->password = "password123";
$user->role = "farmer";

echo "Attempting to register user: " . $user->email . "\n";

if ($user->register()) {
    echo "✅ User registered manually in DB.\n";
    
    try {
        $queue = new Queue();
        $queue->publish('notifications', [
            'event' => 'USER_REGISTERED',
            'email' => $user->email,
            'name' => $user->name,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        echo "✅ Event published to RabbitMQ.\n";
    } catch (Exception $e) {
        echo "❌ RabbitMQ publish failed: " . $e->getMessage() . "\n";
    }

} else {
    echo "❌ User registration failed (might exist).\n";
}
