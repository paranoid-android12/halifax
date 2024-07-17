<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;

require_once (__DIR__ . '/../vendor/autoload.php');
include_once (__DIR__ . '/../Model/connection.php');

class GlobalMethods extends Connection
{

    private $env;

    function __construct()
    {
        $this->env = parse_ini_file('.env');
    }
    /**
     * Global function to execute queries
     *
     * @param string $sqlString
     *   string representing sql query.
     *
     * @return array
     *   the result of query.
     */


    public function verifyToken(){

        // Prevent Outsiders from accessing the API
        if (empty($_SERVER['HTTP_AUTHORIZATION'])) {
            exit;
        }
        //Check existence of token
        if (!preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            header('HTTP/1.0 403 Forbidden');
            echo 'Token not found in request';
            exit;
        }

        //Check header
        $jwt = $matches[1];
        if (!$jwt) {
            header('HTTP/1.0 403 Forbidden');
            echo 'Token is missing but header exists';
            exit;
        }

        // return $matches;
        //Separate token to 3 parts
        $jwtArr = explode('.', $jwt);

        // return $jwtArr;
        $headers = new stdClass();
        // $env = parse_ini_file('.env');
        $secretKey = $this->env["ACS_API_KEY"];

        //Decode received token

        try {
            $payload = JWT::decode($jwt, new Key($secretKey, 'HS512'), $headers);
            return array(
                "code" => 200,
                "payload" => array(
                    "userID" => $payload->data->userID,
                    "username" => $payload->data->username
                )
            );
        } catch (\Throwable $th) {
            // throw $th;
            header('HTTP/1.0 403 Forbidden');
            echo $th;
            exit;
        }
    }


    public function executeGetQuery($sqlString)
    {
        $data = [];
        $errmsg = "";
        $code = 0;

        try {
            if ($result = $this->connect()->query($sqlString)->fetchAll()) {
                foreach ($result as $record) {
                    array_push($data, $record);
                }
                $code = 200;
                $result = null;
                return array("code" => $code, "data" => $data);
            } else {
                $errmsg = "No data found";
                $code = 404;
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg, "data" => $data);
    }

    public function executePostQuery($stmt)
    {
        $errmsg = "";
        $code = 0;

        try {
            if ($stmt->execute()) {
                $code = 200;
                return array("code" => $code, "msg" => 'Successful Query.');
            } else {
                $errmsg = "No data found";
                $code = 404;
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    
    public function prepareEditBind($table, $params, $form, $rowId)
    {
        // UPDATE `educattainment`
        // SET `faculty_ID` = 3, `educ_title` = 'My nutsacks', `educ_school` = 'Nutsack School', `year_start` = '2022', `year_end` = '2023', `educ_details` = 'very nuts, much sacks'
        // WHERE `educattainment_ID` = 26;


        $sql = "UPDATE `$table`
                SET ";

        foreach ($params as $key => $col) {
            //Insertion columns details
            sizeof($params) - 1 != $key ? $sql = $sql . "`$col` = ?, " : $sql = $sql . "`$col` = ? ";
        }
        $sql = $sql . "WHERE `$rowId` = ?";
        $stmt = $this->connect()->prepare($sql);
        foreach ($form as $key => $value) {
            $stmt->bindParam(($key + 1), $form[$key]);
        }

        return $this->executePostQuery($stmt);
    }

    public function getLastID($table)
    {

        $DBName = $this->env["DB_NAME"];
        $sql = "SELECT AUTO_INCREMENT 
                FROM information_schema.TABLES 
                WHERE TABLE_SCHEMA = '$DBName' AND TABLE_NAME = '$table'";

        return $this->executeGetQuery($sql)['data'][0]['AUTO_INCREMENT'];
    }

    public function prepareAddBind($table, $params, $form)
    {
        $sql = "INSERT INTO `$table`(";
        $tempParam = "(";
        $tempValue = "";

        foreach ($params as $key => $col) {
            //Insertion columns details
            sizeof($params) - 1 != $key ? $sql = $sql . $col . ', ' : $sql = $sql . $col . ')';
            //Question marks
            sizeof($params) - 1 != $key ? $tempParam = $tempParam . '?' . ', ' : $tempParam = $tempParam . '?' . ')';
        }

        $sql = $sql . " VALUES " . $tempParam;
        $stmt = $this->connect()->prepare($sql);

        foreach ($form as $key => $value) {
            $stmt->bindParam(($key + 1), $form[$key]);
        }

        return $this->executePostQuery($stmt);
        // return $sql;
    }


    public function saveImage($image, $outputFolder, $fileFormat = 'png', $name, $id)
    {
        try {
            //code...
            // Ensure the output folder exists
            $outputFolder = __DIR__ . $outputFolder . "$id/";
    
            if (!file_exists($outputFolder)) {
                mkdir($outputFolder, 0777, true);
            }
    
            // Extract the actual base64 string (remove the data:image/png;base64, part)
            $base64Data = explode(',', $image)[1];
    
            // Decode the base64 string
            $imageData = base64_decode($base64Data);
    
            // Define the output file path
            $filePath = $outputFolder . $name . '.' . $fileFormat;
    
            // Save the image data to a file
            file_put_contents($filePath, $imageData);
    
            // return $filepath = str_replace("/home/u417870998/domains/gcfams.com/public_html", "" , $filepath);
            return str_replace("C:\\xampp\\htdocs", "", $filePath);
        } catch (\Throwable $th) {
            header('HTTP/1.0 500 Internal Server Error');
            echo 'Token not found in request: ' . $th;
            exit;
        }
    }

    //idk where to put this huhuhu
    public function checkUserExists($email) {

        $sql = "SELECT COUNT(*) AS count FROM `user` WHERE `email` = :email";

        $stmt = $this->connect()->prepare($sql);
        
        $stmt->bindParam(':email', $email);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['count'] > 0;
    }

    public function checkUserNameExists($username) {

        $sql = "SELECT COUNT(*) AS count FROM `user` WHERE `username` = :username";
        $stmt = $this->connect()->prepare($sql);

        $stmt->bindParam(':username', $username);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['count'] > 0;
    }
}