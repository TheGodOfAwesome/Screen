<?php

function create_new_event(
    $event_name, $event_creator, $event_desc, $event_capacity, $event_wallet, $event_video, $event_metadata, $event_response_metadata, $event_start, $event_whitelist, $db
) {
	//Check to see if the event is in the Database. If not add them to the db. 
	$event_query = "SELECT event_id FROM events WHERE event_name= '" . $event_name . "'";
	$event_result = pg_query($db, $event_query);

	$response = "";

	if (pg_num_rows($event_result) > 0) {
		$name = pg_fetch_result($event_result, 0, 0);
		$response = "The event name " . $event_name . " has already been registered!";
	} else {
		$sign_up_timestamp = date('Y-m-d H:i:s', time());
		$event_id = generateId();
		$new_empty_list = "[]";
		$start_amt = 0;
		$event_chain = "polygon";

		// $event_video, $event_metadata, $event_start, $event_whitelist,
		$query = "INSERT INTO events
		(id, event_id, event_name, event_creator, event_desc, event_wallet, event_video, event_metadata, event_response_metadata, event_start, event_whitelist, event_chain, event_ticket_price, event_ticket_crypto, event_capacity, event_rsvps, created_at, updated_at, last_activity_timestamp)
		VALUES
		(DEFAULT, '" . $event_id . "','" . $event_name . "','" . $event_creator . "','" . $event_desc . "','" . $event_wallet . "', '" . $event_video . "', '" . $event_metadata . "', '" . $event_response_metadata . "', '" . $event_start . "', '" . $event_whitelist . "', '" . $event_chain . "','" 
		. $start_amt . "', " . $start_amt . ", " . $start_amt . ", '" . $start_amt . "', '" . $sign_up_timestamp . "', '" . $sign_up_timestamp . "', '" . $sign_up_timestamp . "')";
		$result = pg_query($db, $query);
		$response = "Event Created!"; 
	}
	return $response;
}

function get_event($event_name, $db) {
	// Get event by event_name
	$query = "SELECT * FROM events WHERE event_name = '" . $event_name . "';";
	$result = pg_query($db, $query);
	$event = pg_fetch_all($result);
	return $event;
}

function get_event_by_id($event_id, $db) {
	// Get event by event_id
	$query = "SELECT * FROM events WHERE event_id = '" . $event_id . "';";
	$result = pg_query($db, $query);
	$event = pg_fetch_all($result);
	return $event;
}

function get_events_by_creator($event_creator, $db) {
	// Get event by event_creator
	$query = "SELECT * FROM events WHERE event_creator = '" . $event_creator . "';";
	$result = pg_query($db, $query);
	$events = pg_fetch_all($result);
	return $events;
}

function get_latest_events($page_size, $db) {
	// Get latest events created 
	$query = "SELECT * FROM events order by event_start limit " . $page_size . ";";
	$result = pg_query($db, $query);
	$events = pg_fetch_all($result);
	return $events;
}

function delete_event_by_id($event_id, $db) {
	// Get event by event_id
	$query = "DELETE * FROM events WHERE event_id = '" . $event_id . "';";
	// $query = "SELECT * FROM events WHERE event_id = '" . $event_id . "';";
	$result = pg_query($db, $query);
	$event = pg_fetch_all($result);
	return $event;
}

function create_api_request_log($request, $user_id, $response, $description, $type, $db) {
	$log_timestamp = date('Y-m-d H:i:s', time());
	$query = "INSERT INTO api_request_log
		(id, request, user_id, response, log_timestamp, description, type)
		VALUES 
		(DEFAULT, '" . $request . "','" . $user_id . "','" . $response . "','" . $log_timestamp . "', '" . $description . "', '" . $type . "')";
	$result = pg_query($db, $query);
}

function generateId() {
	return md5(uniqid(time()));
}

?>