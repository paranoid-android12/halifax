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
                'role' => $role, // User role
                'username' => $name
            ]

        );

        return array(
            "token" => JWT::encode($token, $secretKey, 'HS512'),
            "code" => 200
        );
    }

    public function loginValidate($data){
        $credentials = json_decode(file_get_contents(__DIR__ . '/../credentials.json'), true);

        // Iterate through the credentials to find a match
        foreach ($credentials['credentials'] as $credential) {
            if ($credential['username'] === $data->username) {
                // Verify the password using password_verify
                if ($data->password === $credential['password']) {                    
                    return $this->generateToken($credential['role'], $credential['username']);
                } else {
                    return array("token" => "", "code" => 403, "message" => "Invalid password or username");
                }
            }
        }
        return array("token" => "", "code" => 403, "message" => "User not found");
    }
}

?>