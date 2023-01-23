<?php
define("ROOT_PATH", __DIR__ . "/..//..//");
define("DB_CONNECTION_STRING", "pgsql:host=localhost port=5432 dbname=db1 user=postgres password=Qazwer333");

ini_set('extension', 'pgsql.so');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require ROOT_PATH . '/vendor/autoload.php';
// include the base controller file 
require_once ROOT_PATH . "/api/src/Controllers/BaseController.php";
// include the use model file 
require_once ROOT_PATH . "/api/src/Controllers/UserController.php";

require_once ROOT_PATH . "/api/src/Models/UserModel.php";

require_once ROOT_PATH . "/api/src/Models/BaseModel.php";
?>