<?php

// Declare strict types
declare(strict_types=1);

require __DIR__ . "/config/bootstrap.php";

// Split URI into parts
$uriparts = explode("/",strtok($_SERVER["REQUEST_URI"], "?"));

$reqMethod = $_SERVER['REQUEST_METHOD'];

$query = [];
if(isset($_SERVER['QUERY_STRING'])){
    parse_str($_SERVER['QUERY_STRING'], $query);
}

$table = "";
if(isset($uriparts[2])){
    $table = $uriparts[2];
}

$methodName = "";
if(isset($uriparts[3])){
    $methodName = $uriparts[3]."Action";;
}

$userController = new UserController();

if($methodName=="createAction"){

    $loggedIn=$userController->loginAction("usr", false, false);

    if($loggedIn==false){
        $userController->sendOutput('{"message":"Failed to log in", "status":"400"}', 400);
    } else {
        echo $userController->{$methodName}($table);
    }
    
} else if ($methodName=="loginAction"){
    echo $userController->{$methodName}($table);
} else if ($methodName == "deleteAction") {
    $loggedIn=$userController->loginAction("usr", false, false);

    if($loggedIn==false){
        $userController->sendOutput('{"message":"Failed to log in", "status":"400"}', 400);
    } else {
        echo $userController->{$methodName}($table);
    }
} else {
    echo $userController->{$methodName}($table, $query);
}




?> 