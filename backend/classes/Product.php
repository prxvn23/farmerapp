<?php
class Product {
    private $conn;

    public $name, $price, $quantity, $farmerId, $farmerName, $contact, $upi, $image;

    public function __construct($db) {
        $this->conn = $db;
    }

    // ✅ Add Product
    public function add() {
        $collection = $this->conn->selectCollection("products");
        $data = [
            "name" => $this->name,
            "price" => (int)$this->price,
            "quantity" => (int)$this->quantity,
            "farmerId" => $this->farmerId,
            "farmerName" => $this->farmerName,
            "contact" => $this->contact, // ✅ Used as 'contact' in DB
            "upi" => $this->upi,
            "image" => $this->image
        ];
        $result = $collection->insertOne($data);
        return $result->getInsertedCount() > 0;
    }

    // ✅ Get Products by Farmer ID
    public function getByFarmer($farmerId) {
        $collection = $this->conn->selectCollection("products");
        $cursor = $collection->find(["farmerId" => $farmerId]);
        $result = [];

        foreach ($cursor as $doc) {
            $doc['_id'] = (string)$doc['_id'];
            $result[] = $doc;
        }

        return $result;
    }

    // ✅ Get All Products
    public function getAll() {
        $collection = $this->conn->selectCollection("products");
        $cursor = $collection->find();
        $result = [];

        foreach ($cursor as $doc) {
            $doc['_id'] = (string)$doc['_id'];
            $result[] = $doc;
        }

        return $result;
    }

    // ✅ Update Product Price
    public function updatePrice($id, $newPrice) {
        $collection = $this->conn->selectCollection("products");
        $result = $collection->updateOne(
            ["_id" => new MongoDB\BSON\ObjectId($id)],
            ['$set' => ["price" => (int)$newPrice]]
        );
        return $result->getModifiedCount() > 0;
    }

    // ✅ Delete Product
    public function delete($id) {
        $collection = $this->conn->selectCollection("products");
        $result = $collection->deleteOne(["_id" => new MongoDB\BSON\ObjectId($id)]);
        return $result->getDeletedCount() > 0;
    }
    // ✅ Get Single Product by ID
    public function findById($id) {
        try {
            $collection = $this->conn->selectCollection("products");
            $doc = $collection->findOne(["_id" => new MongoDB\BSON\ObjectId($id)]);
            if ($doc) {
                $doc['_id'] = (string)$doc['_id'];
                return $doc;
            }
            return null;
        } catch (Exception $e) {
            return null;
        }
    }

    // ✅ Update Product (Generic)
    public function update($id, $data) {
        $collection = $this->conn->selectCollection("products");
        $updateFields = [];
        
        foreach ($data as $key => $value) {
            // Add validation here if needed
            $updateFields[$key] = $value;
        }

        $result = $collection->updateOne(
            ["_id" => new MongoDB\BSON\ObjectId($id)],
            ['$set' => $updateFields]
        );
        return $result->getModifiedCount() > 0;
    }
}
