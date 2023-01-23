<?php
namespace PgsqlTest\Testing;
/**
 * Created by
 * User: ${NAME}
 * Date: 2020/12/16
 * Time: 10:47
 */

require_once __DIR__."/..//..//../autoload.php";
use Cheney\Pgsql\Pgsql;

$pgsql = new Pgsql('postgres','postgres','','172.16.200.58');
$res = $pgsql->table('users_tbl')
    ->where('id','=',1)
    ->find();
print_r($res);