<?php
include_once "./Controller/global.php";

use Firebase\JWT\JWT;

class Login extends GlobalMethods{

    function generateToken($role, $name)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + (60 * 60);

        $env = parse_ini_file('.env');
        $secretKey = $env["ACS_API_KEY"];
        $token = array(
            'iss' => 'localhost', // Issuer
            'aud' => 'localhost', // Audience
            'exp' => time() + 10000, //in seconds, 1hour
            'data' => [
                'userID' => $role, // User role
                'username' => $name
            ]

        );

        return array(
            "token" => JWT::encode($token, $secretKey, 'HS512'),
            "code" => 200
        );
    }

    public function loginValidate($form){
        $sql = "SELECT * FROM `user` WHERE `email` = '$form->email' OR `username` = '$form->email'";
        $result = $this->executeGetQuery($sql);
        // echo json_encode($form);
        if ($result['code'] == 200) {
            // echo json_encode($result);
            $passValid = password_verify($form->password, $result['data'][0]['password']);
            if ($passValid) {
                return $this->generateToken(
                    $result['data'][0]['user_ID'],
                    $result['data'][0]['username'],
                );
            } else {
                return array("token" => "", "code" => 403);
            }
        } else {
            return array("token" => "", "code" => 404, "message" => "User not found", "form" => $form);
        }
    }


    public function registerValidate($form){
        if ($this->checkUserExists($form->email)) {
            return array("token" => "", "code" => 403, "message" => "User Already Exists");
        }

        if($this->checkUserNameExists($form->username)){
            return array("token" => "", "code" => 403, "message" => "Username Already Exists");
        }

        $sql = "INSERT INTO `user`(`username`, `email`, `password`) VALUES ('$form->username', '$form->email', '$form->password')";
        $result = $this->executeGetQuery($sql);
        if ($result['code'] == 200) {
            return $this->generateToken(
                $result['data'][0]['user_ID'],
                $result['data'][0]['username'],
            );
        } else {
            return array("token" => "", "code" => 404, "message" => "Registration Unsuccessful.");
        }
    }

    public function googleLogin($form){
        // Check if the user exists and if not, register the user
        if (!$this->checkUserExists($form->email)) {
            $registrationResult = $this->registerValidate($form);
            if ($registrationResult['code'] != 200) {
                return $registrationResult;
            }
        } else {
            $sql = "SELECT * FROM `user` WHERE `email` = :email";
            $stmt = $this->connect()->prepare($sql);
            $stmt->bindParam(':email', $form->email);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                return $this->generateToken(
                    $result['data'][0]['user_ID'],
                    $result['data'][0]['username'],
                );
            } else {
                return array("token" => "", "code" => 500, "message" => "An error occurred while logging in.");
            }
        }

    }
}

?>