<?php
require __DIR__ . '/../vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class Queue {
    private $conn;
    private $channel;

    public function __construct(
        $host = null, $port = null, $user = null, $pass = null, $vhost = '/'
    ) {
        $host = $host ?: getenv('RABBITMQ_HOST') ?: 'rabbitmq';
        $port = $port ?: (getenv('RABBITMQ_PORT') ?: 5672);
        $user = $user ?: (getenv('RABBITMQ_USER') ?: 'guest');
        $pass = $pass ?: (getenv('RABBITMQ_PASS') ?: 'guest');

        $this->conn = new AMQPStreamConnection($host, (int)$port, $user, $pass, $vhost);
        $this->channel = $this->conn->channel();
    }

    public function publish($queueName, $payload) {
        $this->channel->queue_declare($queueName, false, true, false, false);
        if (is_array($payload)) $payload = json_encode($payload);
        $msg = new AMQPMessage($payload, ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]);
        $this->channel->basic_publish($msg, '', $queueName);
    }

    public function consume($queueName, callable $handler) {
        $this->channel->queue_declare($queueName, false, true, false, false);
        $this->channel->basic_qos(null, 1, null);
        $this->channel->basic_consume($queueName, '', false, false, false, false, function($msg) use ($handler) {
            try {
                $body = $msg->getBody();
                $data = json_decode($body, true) ?: $body;
                $handler($data);
                $msg->ack();
            } catch (\Throwable $e) {
                error_log('Consumer error: ' . $e->getMessage());
                $msg->nack(false, true);
            }
        });
        while ($this->channel->is_open()) {
            $this->channel->wait();
        }
    }

    public function __destruct() {
        if ($this->channel) $this->channel->close();
        if ($this->conn) $this->conn->close();
    }
}
