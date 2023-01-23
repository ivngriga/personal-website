<?php
class UserController extends BaseController {
    public function __call($name, $arguments){
        $this->sendOutput("{'Status':'404', 'Message':'Invalid URL'}", 404);
    }
    public function listAction($table, $parsed_query){
        
        if(strtoupper($_SERVER["REQUEST_METHOD"]) == 'GET'){
            $customparams = "";

            if($table!="msg"){
                $this->sendOutput("{'Status':'400', 'Message':'Incorrect URL'}", 400);
            }

            if(!isset($parsed_query["limit"])){
                $this->sendOutput("{'Status':'400', 'Message':'Limit must be included as param'}", 400);
            }

            $limit = $parsed_query["limit"];

            if(!is_numeric($limit) || $limit<=0){
                $this->sendOutput("{'Status':'400', 'Message':'Limit must be INT value > 0'}", 400);
            }

            $userModel = new UserModel();

            $allColumns = array_map(function ($dict){
                return $dict['0']; 
            }, $userModel->getAllColumns($table));

            $data=array();
            foreach($allColumns as $column){
                if(isset($parsed_query[$column])){
                    $data[$column] = $parsed_query[$column];
                }
            }
    
            
            $response = $userModel->getMessages($table, $limit, $data);
            if($response==false){
                $this->sendOutput("{'Status':'400', 'Message':'No messages found'}", 500);
            } else {
                $response = json_encode($response);
                $response = '{"messages": ' . $response . ', "status": "200"}';
                $this->sendOutput($response, 200);
            }
            
        } else {
            $this->sendOutput("{'Status':'422', 'Message':'Request Method Not Supported (Must be GET)'}", 422);
        }
        
    }

    public function createAction($table){
        if(strtoupper($_SERVER["REQUEST_METHOD"]) == 'POST'){
            $data=array();

            $userModel = new UserModel();

            $toGenerate = array_map(function ($dict){
                return $dict['0']; 
            }, $userModel->toGenerate($table));

            $keys = array_map(function ($dict) {
                return $dict['0']; 
            }, $userModel->getColumns($table));

            $json = file_get_contents('php://input');
            $posted = json_decode($json, true);
            
            foreach($toGenerate as $field){
                $methodName = str_replace($table, "", $field);
                $generated = $userModel->{"gen".$methodName}();
                $data[$field] = $generated;
            }

            if(isset($posted["usrname"])){
                $posted[$table . "user"] = $posted["usrname"];
            }


            foreach($keys as $key => $value){
                if (isset($posted[$value])) {
                    $data[$value] = $posted[$value];
                } else {
                    $this->sendOutput("{'Status':'400', 'Message':'Missing fields.'}", 400);
                }
            }

            $result=$userModel->createEntry($table, $data);
            if($result==false){
                $this->sendOutput('{"Status":"500", "Message":"Internal Server Error"}', 500);
            }
            $msg = json_encode($data);
            $output = array("Status"=>"200", "Message"=>"Entry succesfully created.", "msg"=>stripslashes($msg));
            $this->sendOutput(json_encode($output), 200);
        } else {
            $output = array("Status"=>"422", "Message"=>"Request Method Not Supported (Must be POST)");
            $this->sendOutput(json_encode($output), 422);
        }
    }

    public function loginAction($table, $registerUser=true, $sendOutput=true){
        $json = file_get_contents('php://input');

        if(strtoupper($_SERVER["REQUEST_METHOD"]) != 'POST'){
            $output = array("Status"=>"422", "Message"=>"Request Method Not Supported (Must be POST)");
            $this->sendOutput(json_encode($output), 422);
        }

        $posted = json_decode($json);
        if(isset($posted->usrpass) && isset($posted->usrname)){
            $username = $posted->usrname;
            $passwordhash = $posted->usrpass;
        } else {
            $output = array("Status"=>"400", "Message"=>"Invalid login body");
            $this->sendOutput(json_encode($output), 400);
        }

        $userModel = new UserModel();
        $entry = $userModel->getEntry($table, array('usrname' => $username));

        if($entry != false){
            if($entry[0]["usrpass"]==$passwordhash){
                if($sendOutput==true){
                    $output = array("Status"=>"200", "Message"=>"User Logged in");
                    $this->sendOutput(json_encode($output), 200);
                } else {
                    
                    return true;
                }
            } else {
                $output = array("Status"=>"400", "Message"=>"Incorrect password");
                $this->sendOutput(json_encode($output), 400);
            }
        } else if ($registerUser==true){
            $data=array();

            $toGenerate = array_map(function ($dict){
                return $dict['0']; 
            }, $userModel->toGenerate($table));

            foreach($toGenerate as $field){
                $methodName = str_replace($table, "", $field);
                $generated = $userModel->{"gen".$methodName}();
                $data[$field] = $generated;
            }

            $data["usrname"] = $username;
            $data["usrpass"] = $passwordhash;

            $result = $userModel->createEntry($table, $data);

            if($result==false){
                $output = array("Status"=>"500", "Message"=>"Internal Server Error");
                $this->sendOutput(json_encode($output), 500);
            } else {
                $output = array("Status"=>"200", "Message"=>"Entry succesfully created.");
                $this->sendOutput(json_encode($output), 200);
            }
        } else {
            $output = array("Status"=>"400", "Message"=>"Invalid Login Credentials");
            $this->sendOutput(json_encode($output), 400);
        }
        
    }

    public function deleteAction($table){
        $json = file_get_contents('php://input');
        $data = array();

        if(strtoupper($_SERVER["REQUEST_METHOD"]) != 'POST'){
            $output = array("Status"=>"422", "Message"=>"Request Method Not Supported (Must be POST)");
            $this->sendOutput(json_encode($output), 422);
        }

        $posted = json_decode($json);

        $userModel = new UserModel();

        $allColumns = array_map(function ($dict){
            return $dict['0']; 
        }, $userModel->getAllColumns($table));

        foreach($allColumns as $column){
            if(isset($posted->$column) && $posted->$column!=""){
                $data[$column] = $posted->$column;
            }
        }

        if(sizeof($data)==0){
            $output = array("Status"=>"400", "Message"=>"No identifiers present.");
            $this->sendOutput(json_encode($output), 400);
        }
        
        $entry = $userModel->getEntry($table,  $data);
        $messagesFound=count($entry);
        
        if($messagesFound==1){
            $userModel->deleteEntry($table, $data);
            $output = array("Status"=>"200", "Message"=>"Message deleted");
            $this->sendOutput(json_encode($output), 200);
        } else if ($messagesFound==0) {
            $output = array("Status"=>"400", "Message"=>"No messages found with your identifiers.");
            $this->sendOutput(json_encode($output), 400);
        } else {
            $output = array("Status"=>"400", "Message"=>"Too many messages found. You may only delete one message per request.");
            $this->sendOutput(json_encode($output), 400);
        }
    }
}