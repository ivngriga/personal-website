<?php
/**
 * Created by
 * User: Cheney
 * Date: 2020/12/16
 * Time: 10:11
 */

namespace Cheney\Pgsql;

use function array_push;
use Cheney\Pgsql\Exception\PgsqlException;
use function implode;
use function pg_connect;
use function pg_fetch_all;
use function pg_fetch_assoc;
use function pg_query;
use function pg_insert;
use function pg_update;
use function pg_conver;
use function pg_fetch_object;
use function pg_free_result;
use function pg_close;

class Pgsql
{
    /**
     * 链接字符串
     * @var string
     */
    private $dsn;
    /**
     * 链接标识
     * @var string
     */
    private $conn;

    /**
     * @var array
     */
    private $paramWhere;

    /**
     * 查询字段
     * @var string
     */
    private $field='*';

    /**
     * 数据表名称
     * @var string
     */
    private $table;

    /**
     * 排序支付串
     * @var string
     */
    private $orderStr;

    /**
     * 分组查询
     * @var string
     */
    private $groupStr;

    /**
     * 分页查询
     * @var string
     */
    private $pageStr;

    public function __construct($dbName,$user,$password,$host='127.0.0.1',$port=5432)
    {
        $dsn = sprintf("host=%s port=%d dbname=%s user=%s password=%s",
            $host,
            $port,
            $dbName,
            $user,
            $password
        );
        $this->dsn = $dsn;
    }

    /**
     * connection
     * @return $this
     * @throws PgsqlException
     */
    public function connect()
    {
        try{
            $this->conn = pg_connect($this->dsn);
            return $this;
        }catch (PgsqlException $e){
            throw new PgsqlException("connection failed");
        }
    }

    /**
     * @return $this
     * @throws PgsqlException
     */
    public function pconnect()
    {
        try{
            $this->conn = pg_pconnect($this->dsn);
            return $this;
        }catch (PgsqlException $e){
            throw new PgsqlException("connection failed");
        }
    }

    /**
     * Reconnect to the database if a connection is missing.
     *
     * @return void
     */
    protected function reconnect()
    {
        if (is_null($this->conn) || !$this->conn) {
            $this->connect();
        }
    }

    /**
     * 关闭连接
     */
    protected function pgClose(){
        pg_close($this->conn);
    }

    /**
     * 恢复初始值
     */
    private function clear(){
        //查询完成重置结果
        $this->field = '*';
        $this->table    = null;
        $this->orderStr = null;
        $this->groupStr = null;
        $this->pageStr  = null;
    }

    /**
     * 查询列表
     * @return array
     * @throws PgsqlException
     */
    public function get(){
        try{
            $this->reconnect();
            $result = pg_query($this->conn, $this->query());
            $data = pg_fetch_all($result);
            //释放结果内存
            pg_free_result($result);
            $this->clear();
            return $data;
        }catch (PgsqlException $e){
            throw $e;
        }
    }

    /**
     * 查询单条记录
     * @return array|null
     * @throws PgsqlException
     */
    public function find()
    {
        try{
            $this->reconnect();
            $result = pg_query($this->conn, $this->query());
            $data = pg_fetch_assoc($result);
            //释放结果内存
            pg_free_result($result);
            $this->clear();
            return $data ? $data : null;
        }catch (PgsqlException $e){
            throw $e;
        }
    }

    /**
     * 设置查询条件
     * @param $col
     * @return $this
     */
    public function select($col)
    {
        $this->field = $col;
        return $this;
    }

    /**
     * 设置表名称
     * @param string $name
     * @return $this
     */
    public function table(string $name)
    {
        $this->table = $name;
        return $this;
    }

    /**
     * @param $field
     * @param $operator      操作符
     * @param $value
     * @param string $connector 连接符
     * @return $this
     */
    public function where($field,$operator,$value,$connector='')
    {
        $tmpType = gettype($value);
        $_value = ($tmpType =='string') ? "'.$value.'": $value;
        $wherStr = $connector .' '. $field.' '.$operator.' '.$_value.' ';
        $this->setParams($wherStr);
        return $this;
    }

    /**
     * @param $field
     * @param $value
     * @return $this
     */
    public function like($field,$value,$connector='')
    {
        $wherStr = $connector ." ".$field." like '".$value."' ";
        $this->setParams($wherStr);
        return $this;
    }

    /**
     * @param $field
     * @param $value
     * @return $this
     */
    public function whereIn($field,$value,$connector='')
    {
        $wherStr = $connector.' '.$field.' in ('.$value.') ';
        $this->setParams($wherStr);
        return $this;
    }

    /**
     * @param $field
     * @param string $sort
     * @return $this
     */
    public function orderBy($field,$sort='DESC')
    {
        $this->orderStr = ' ORDER BY '.$field.' '.$sort;
        return $this;
    }

    /**
     * @param $field
     * @return $this
     */
    public function groupBy($field)
    {
        $this->groupStr = ' GROUP BY '.$field;
        return $this;
    }

    /**
     * @param int $page 当前页
     * @param int $size 没页总数
     */
    public function paginate($page=1,$size=10)
    {
        $limit = ($page-1) * $size;
        $this->pageStr = sprintf("limit %d offset %d",$size,$limit);
        return $this;
    }

    /**
     * @param $query
     * @return array
     * @throws ContainerException
     * @throws DbException
     * @throws ReflectionException
     */
    public function insert(array $data): array
    {
        try{
            $this->reconnect();
            $result = pg_insert($this->conn, $this->table, $data);
            $this->pgClose();
            return $result;
        }catch (\Exception $e){
            throw $e;
        }
    }

    /**
     * @param $table
     * @param $updateData
     * @param $where
     */
    public function update(array $updateData,array $where)
    {
        try{
            $this->reconnect();
            $result = pg_update($this->client, $this->table, $updateData, $where);
            $this->pgClose();
            return ($result === false) ? [] : $result;
        }catch (\Exception $e){
            throw $e;
        }
    }

    /**
     * @param array $where
     * @throws PgsqlException
     */
    public function del(array $where)
    {
        try{
            $this->reconnect();
            $result = pg_delete($this->client,$this->table,$where);
            return $result;
        }catch (\Exception $e){
            throw $e;
        }
    }

    /**
     * 处理查询条件
     * @return bool|string
     */
    private function gatParams()
    {
        if(isset($this->paramWhere) && count($this->paramWhere) > 0){
            return implode('',$this->paramWhere);
        }else{
            return false;
        }
    }

    /**
     * 设置查询条件
     * @param null $value
     */
    private function setParams($value=null){
        if(is_null($value) || !isset($value) || empty($value)){
            $this->paramWhere = null;
        }
        if(is_array($this->paramWhere)){
            array_push($this->paramWhere,$value);
        }else{
            $this->paramWhere = array($value);
        }
    }

    /**
     * 构造查询语句
     * @return string
     * @throws \Exception
     */
    private function query()
    {
        try{
            $where = $this->gatParams();
            $sql = sprintf("select %s from %s",$this->field, $this->table);
            if($where){
                $sql .= ' WHERE '.$where;
            }
            if($this->groupStr != null){
                $sql .= $this->groupStr;
            }
            if($this->orderStr != null){
                $sql .= $this->orderStr;
            }
            if($this->pageStr != null){
                $sql .= $this->pageStr;
            }
            $sql .= ';';
            //清除查询缓存
            $this->setParams(null);
            return $sql;
        }catch (\Exception $e){
            throw $e;
        }
    }
}