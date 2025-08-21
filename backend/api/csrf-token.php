<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once '../utils/csrf.php';

echo json_encode(["token" => generateCsrfToken()]);
