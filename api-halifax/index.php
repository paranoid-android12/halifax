<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

include_once "./Controller/global.php";
include_once "./Controller/tunnel.php";

$globalOb = new GlobalMethods();
$tunnel = new Tunnel();
//Converts request link to array
if (isset($_REQUEST['request'])) {
    $request = explode('/', $_REQUEST['request']);
    //echo json_encode($request);
} else {
    //echo json_encode(array('message' => 'failed request'));
    http_response_code(404);
}

// //Main request switch endpoints
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // $ver = $globalOb->verifyToken();
        switch ($request[0]) {
            case 'getProduct':
                echo json_encode($tunnel->toGetProduct());
                break;
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        // switch ($request[0]) {
        //     case 'login':
        //         echo json_encode($tunnel->toLogin($data));
        //         break;

        //     case 'addProduct':
        //         $ver = $globalOb->verifyToken();
        //         echo json_encode($tunnel->toAddProduct($data));
        //         break;

        //     default:
        //         http_response_code(403);
        //         break;
        // }
        break;
    default:
        http_response_code(404);
        break;
}

?>
