<?php

// Fetches every single file in Model
foreach (glob("./Model/*.php") as $filename) {
    include_once $filename;
}
// include_once "./Model/Login/login.php";
include_once __DIR__ . '/./global.php';

class Tunnel extends GlobalMethods{
    private $product;
    private $login;

    public function __construct()
    {
        $this->product = new Product();
        $this->login = new Login();
        // $this->acs = new ACS();
    }

    public function toLogin($data){
        return $this->login->loginValidate($data);
    }

    public function toRegister($data){
        return $this->login->registerValidate($data);
    }

    public function toGoogleLogin($data){
        return $this->login->googleLogin($data);
    }

    public function toGetProduct(){
        return $this->product->getProduct();
    }

    public function toAddCart($data, $id){
        return $this->product->addCart($data, $id);
    }

    public function toGetCart($id){
        return $this->product->getCart($id);
    }

    public function toQuantity($data){
        return $this->product->quantity($data);
    }


}