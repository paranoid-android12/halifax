<?php

// Fetches every single file in Model
foreach (glob("./Model/*.php") as $filename) {
    include_once $filename;
}
// include_once "./Model/Login/login.php";
include_once __DIR__ . '/./global.php';

class Tunnel extends GlobalMethods{
    private $product;

    public function __construct()
    {
        $this->product = new Product();
        $this->login = new Login();
        // $this->acs = new ACS();
    }

    public function toLogin($data){
        return $this->login->loginValidate($data);
    }

    public function toGetProduct(){
        return $this->product->getProduct();
    }

    public function toAddCart($data, $id){
        return $this->product->addCart($data, $id);
    }

    public function toGetCart($id){
        // return $this->product->getCart()
    }

}