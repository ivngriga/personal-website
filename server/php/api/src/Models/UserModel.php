<?php
// Layer for executing more complex database interactions
require_once ROOT_PATH . "/api/src/Models/BaseModel.php";
class UserModel extends BaseModel{
    public function getMessages($table, $limit, $identifiers){
        $finalstr = "";
        $finalparams = [];

        if(sizeof($identifiers)>0){
            $finalstr = "WHERE ";
            foreach($identifiers as $key=>$value){
                $finalstr = $finalstr .$key. "= ? ";
                array_push($finalparams, $value);
            }
        }
        array_push($finalparams, $limit);
        
        return $this->executeQuery("SELECT * FROM $table ".$finalstr." LIMIT ?", $finalparams);
    }

    public function getAllColumns($table){
        return $this->executeQuery("SELECT column_name
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = '$table'");
    }

    public function getColumns($table){
        return $this->executeQuery("SELECT column_name
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = '$table' and is_nullable = 'NO'");
    }

    public function getEntry($table, $identifiers){
        $finalstr = "";
        $finalparams = [];
        foreach($identifiers as $key=>$value){
            $finalstr = $finalstr . $key . "= ? ";
            array_push($finalparams, $value);
        }
        return $this->executeQuery("SELECT * FROM $table WHERE " . $finalstr, $finalparams);
    }

    public function deleteEntry($table, $identifiers){
        $finalstr = "";
        $finalparams = [];
        foreach($identifiers as $key=>$value){
            $finalstr = $finalstr . $key . "= ? ";
            array_push($finalparams, $value);
        }
        return $this->executeQuery("DELETE FROM $table WHERE " . $finalstr, $finalparams);
    }

    public function createEntry($table, $data){
        $keys = implode(",", array_keys($data));
        $values = implode(",",  array_map(function ($val) {
            if(is_int($val)){
                return $val; 
            } else if(is_string($val)) {
                return "'".$val."'"; 
            }
            
        }, array_values($data)));
        
        
        return $this->executeQuery("INSERT INTO $table ($keys) VALUES ($values)");
    }

    public function toGenerate($table){
        return $this->executeQuery("SELECT column_name
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = '$table' and is_nullable = 'YES'");
    }

    public function genid(){
        return random_int(10000000, 99999999);
    }
}