<?php

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');
header('Content-Type: application/json');

// the following constant will help ensure all other PHP files will only work as part of this API.
if (!defined('CONST_INCLUDE_KEY')) {define('CONST_INCLUDE_KEY', 'd4e2ad09-b1c3-4d70-9a9a-0e6149302486');}

// run the class autoloader
require_once ('./services/app_autoloader.php');
require_once ('./config/conn.php');
require_once ('./services/request_handler.php');
require_once ('./services/db_classes/db_service.php');

//--------------------------------------------------------------------------------------------------------------------
// if this API must be used with a GET, POST, PUT, DELETE or OPTIONS request
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestPayload = json_decode(file_get_contents('php://input'), true);

// retrieve the inbound parameters based on request type.
if (in_array($requestMethod, ["GET", "POST", "PUT", "DELETE", "OPTIONS"])) {
	// Move the request array into a new variable and then unset the apiFunctionName 
	// so that we don't accidentally snag included interfaces after this.
	$requestMethodArray = array();
	$requestMethodArray = $_REQUEST;
	
	if (isset($requestPayload))								{$requestMethodArray['requestPayload'] = $requestPayload;}
	if (isset($requestMethodArray['apiKey']))				{$apiKey = $requestMethodArray['apiKey'];}
	if (isset($requestMethodArray['api_key']))				{$api_key = $requestMethodArray['api_key'];}
	if (isset($requestMethodArray['token']))				{$token = $requestMethodArray['token'];}
	if (isset($requestMethodArray['apiToken']))				{$apiToken = $requestMethodArray['apiToken'];}
	if (isset($requestMethodArray['function']))				{$functionName = $requestMethodArray['function'];}
	if (isset($requestMethodArray['functionParams']))		{$functionParams = $requestMethodArray['functionParams'];}

	// decode the function parameters array.
	if (isset($functionParams) && $functionParams != '') {
		$functionParams = json_decode($functionParams, true);
	}

	// instantiate this class and validate the API request
	$cApiHandler = new API_Handler();
	$res = App_Response::getResponse('200');
	// Requests should always include the API Key and JSON Web Token
	// Validate Users
	if (isset($api_key) && isset($token)) {
		// $res = validateUserRequestV1($api_key, $token, $db);
		if ($res['response'] !== '200') {
			// if request is not valid, then raise an error message.
			$res = json_encode($res);
		} else {
			$data = $requestMethodArray;
			if ($requestMethod == 'GET') {
				$res = get($data, $res, $db);
			} else if ($requestMethod == 'POST') {
				$res = post($data, $res, $db);
			} else if ($requestMethod == 'PUT') {
				$res = put($data, $res, $db);
			} else if ($requestMethod == 'Delete') {
				$res = delete($data, $res, $db);
			}
			// encode and return
			$res = json_encode($res, JSON_PRETTY_PRINT);
		}
		echo($res);
	} else {
		$res= App_Response::getResponse('403');
		$res['responseDescription'] .= " Missing API key or token.";
		$res = json_encode($res);
		echo($res);
	}

	if (isset($cApiHandler)) {unset($cApiHandler);}

} else {
	$returnArray = App_Response::getResponse('405');
	echo(json_encode($returnArray));
}

function get($data, $res, $db) {
	// $res["Request Method"] = "Get";
	if (isset($data['event_id'])) {
		$res['responsePayload'] = get_event_by_id($data['event_id'], $db);
	} else if (isset($data['event_name'])) {
		$res['responsePayload'] = get_event($data['event_name'], $db);
	} else if (isset($data['event_creator'])) {
		$res['responsePayload'] = get_events_by_creator($data['event_creator'], $db);
	} else if (isset($data['page_size'])) {
		$res['responsePayload'] = get_latest_events($data['page_size'], $db);
	} else {
		$res['responsePayload'] = get_latest_events(20, $db);
	}
	return $res;
}

function post($data, $res, $db) {
	// $res["Request Method"] = "Post";
	$payload = $data['requestPayload'];
    if (isset($payload['api_key']) && isset($payload['token'])) {
		$res = validateUserRequestV1($payload['api_key'], $payload['token'], $db);
		$res['requestPayload'] = $payload;
	} else if (isset($payload['user']) && isset($payload['token'])) {
		$res = validateUserRequestV2($payload['token'], $payload['user'], $db);
		$res['token'] = $payload['token'];
	} else if (isset($payload['test'])) {
		$res['test'] = 'tested';
	}
	return $res;
}

function put($data, $res, $db) {
	// $res["Request Method"] = "Put";
	$data = $data['requestPayload'];
    if (isset($data['event_name']) && isset($data['event_creator']) && isset($data['event_desc']) 
		&& isset($data['event_capacity']) && isset($data['event_wallet'])
    ) {
        $code = 200;
        $request = implode(" | ", $data);
        $event_name = $data['event_name'];
        $event_creator = $data['event_creator'];
        $event_desc = $data['event_desc'];
        $event_video = $data['event_video'];
        $event_metadata = $data['event_metadata'];
        $event_response_metadata = $data['event_response_metadata'];
        $event_start = $data['event_start'];
        $event_capacity = $data['event_capacity'];
        $event_whitelist = $data['event_whitelist'];
        $event_wallet = $data['event_wallet'];

		$response = create_new_event(
			$event_name, $event_creator, $event_desc, $event_capacity, $event_wallet, $event_video, $event_metadata, $event_response_metadata, $event_start, $event_whitelist, $db
		);

        if ($response == "Event Created!") {
			$res["message"] = $response;
            $res['responsePayload'] =
			array(
				"event_name" => $event_name,
				"event_creator" => $event_creator,
				"event_desc" => $event_desc
			);
        } 
		else {
			$res = App_Response::getResponse('405');
			$res["message"] = $response;
        }
    }
    $request = "Request: " .  $data['event_name'] . ", " . $data['event_creator'] . ", " . $data['event_desc'];
    $request = (strlen($request) < 100 ? $request : substr($request,0,96) . "..."); 
    $description = "User reg: Username => " . $data['event_creator'];
    $description = (strlen($description) < 100 ? $description : substr($description,0,96) . "..."); 
    create_api_request_log($request, $data['event_creator'], $response, $description, 'Put', $db);
	return $res;
}

function delete($data, $res, $db) {
	// $res["Request Method"] = "Delete";
	if (isset($data['event_id'])) {
		$res['responsePayload'] = delete_event_by_id($data['event_id'], $db);
	}
	return $res;
}