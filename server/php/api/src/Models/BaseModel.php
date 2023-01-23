<?php

require ROOT_PATH . '/vendor/autoload.php';
// Model for basic interaction with Database (execute simple queries)
class BaseModel{
    protected $connection = null;
    public function __construct()
    {
        $this->connection = new PDO(DB_CONNECTION_STRING);
    	
        if ( $this->connection == false) {
            throw new Exception("Could not connect to database.");   
        }	
    }

    public function executeQuery($query="", $params=[]){
        $stmt = $this->connection->prepare($query);
        
        $i=1;
        foreach($params as $param){
            if(is_numeric($param)){
                $stmt->bindValue($i, intval($param), PDO::PARAM_INT);
            } else if (is_string($param)) {
                $stmt->bindValue($i, $param, PDO::PARAM_STR);
            }
            $i+=1;
        }

        $stmt->execute();
        $result=$stmt->fetchAll();

        return $result;
    }

}