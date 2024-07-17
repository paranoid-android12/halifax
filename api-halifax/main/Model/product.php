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

    public function addCart($form, $id){
                //Initial adding of product
                $params = array('product_ID', 'user_ID', 'quantity');
                $tempForm = array(
                    $form->product->product_ID,
                    $id,
                    $form->count,
                );
        
                try {
                    //code...
                    return $this->prepareAddBind('cart', $params, $tempForm);
                } catch (\Throwable $th) {
                    header('HTTP/1.0 500 Internal Server Error');
                    echo 'Token not found in request';
                    exit;
                }
        
    }

    public function getProduct(){
        $sql = "SELECT * FROM product;";
        return $this->executeGetQuery($sql)['data'];
    }

    public function getCart($id){
        $sql = "SELECT *
                FROM `cart`
                INNER JOIN product on `cart`.`product_ID`=`product`.`product_ID`
                WHERE user_ID = $id;";
        return $this->executeGetQuery($sql)['data'];
    }

    public function quantity($data){
        $params = array('quantity');
        $tempForm = array(
            $data->quantity,
            $data->cart_ID
        );

        try {
            //code...
            return $this->prepareEditBind('cart', $params, $tempForm, "cart_ID");
        } catch (\Throwable $th) {
            header('HTTP/1.0 500 Internal Server Error');
            echo 'Query issue: ' . $th;
            exit;
        }
    }
}
