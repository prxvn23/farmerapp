
## Added by Assistant
- Dockerized client (nginx), backend (PHP+MongoDB ext), RabbitMQ, worker.
- Mongo connection now reads from env `MONGO_URI`, defaults to `mongodb://mongodb:27017`.
- RabbitMQ helper (`backend/classes/Queue.php`) and consumer (`backend/workers/consumer.php`).
- Cron job script at `cron/cleanup.php`.
- Grunt tasks in `/grunt` to minify React build assets.

### Quickstart (local)
```bash
# from repo root
docker compose up -d --build
# app: http://localhost:3000 (client), http://localhost:8000 (backend API)
# RabbitMQ UI: http://localhost:15672  (guest / guest)
```

### Integrate queue publishing
In `backend/api/register.php` after successful registration and in `backend/api/products/addProduct.php` after product insert:
```php
require_once __DIR__ . '/../classes/Queue.php';
$queue = new Queue();
$queue->publish('events', [
  'type' => 'user.registered', // or 'product.added'
  'payload' => [...],
  'ts' => time()
]);
```
