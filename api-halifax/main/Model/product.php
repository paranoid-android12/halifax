<?php
include_once(__DIR__ . '/../Controller/global.php');
class Product extends GlobalMethods
{
    public function getEvaluation($id)
    {
        $sql = "SELECT * FROM `evaluation` 
                WHERE faculty_ID = $id";

        $result = $this->executeGetQuery($sql);
        if ($result['code'] == 200) {
            $data = $result['data'];
            return $this->secured_encrypt($data);
        }
    }

    public function getProduct(){
        $sql = "SELECT * FROM product;";
        return $this->executeGetQuery($sql)['data'];
    }
}
