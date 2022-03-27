<?php

echo "Setting Up Database.\n" . '</br>';

include "conn.php";

echo "Connected!\n" . '</br>';


// $event_video, $event_metadata, $event_start,
// Setup database tables.
$query = "CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            event_id VARCHAR(100)               UNIQUE NOT NULL,
            event_name VARCHAR(100) 	        UNIQUE NOT NULL,
            event_creator VARCHAR(100) 	               NOT NULL,
            event_desc VARCHAR(65000) 			       NOT NULL,
            event_email VARCHAR(100) 		                   ,
            event_wallet VARCHAR(5000) 			       NOT NULL,
            event_video VARCHAR(5000) 			               ,
            event_metadata VARCHAR(5000) 			           ,
            event_response_metadata VARCHAR(5000) 	           ,
            event_whitelist VARCHAR(5000) 			           ,
            event_start VARCHAR(5000) 			               ,
            event_chain VARCHAR(100) 			               ,
            event_ticket_price numeric(10,2)                   ,
            event_ticket_crypto numeric(10,6)                  ,
            event_capacity                                  INT,
            event_rsvps                    		            INT,
            event_pic_url VARCHAR(1000) 			           ,
            event_attending VARCHAR(65000)   		           ,
            settings VARCHAR(65000)   		                   ,
            transactions VARCHAR(65000)   		               ,
            credits numeric(10,2)                              ,
            phone_number VARCHAR(100)                    UNIQUE,
            cover_photo VARCHAR(1000) 			               ,
            activity_log VARCHAR(65000) 			           ,
            email_verified varchar(10)                         ,
            wallet_verified varchar(10)                        ,
            status VARCHAR(1000) 			                   ,
            address VARCHAR(10000) 			                   ,
            city VARCHAR(1000) 			                       ,
            state VARCHAR(1000) 			                   ,
            country_code VARCHAR(20) 			               ,
            zip_code VARCHAR(20) 			                   ,
            subscription_date TIMESTAMP 	                   ,
            subscription_end_date TIMESTAMP                    ,
            subscription_type VARCHAR(50)                      ,
            locale VARCHAR(50) 						           ,
            timezone VARCHAR(50) 					           ,
            created_at TIMESTAMP 				       NOT NULL,
            updated_at TIMESTAMP 				               ,
            last_activity_timestamp TIMESTAMP       NOT NULL
        );";

$result = pg_query($db, $query);

$query = "CREATE TABLE IF NOT EXISTS api_request_log (
    id SERIAL PRIMARY KEY,
    request VARCHAR(1000)                   ,
    user_id VARCHAR(100)                    ,
    response VARCHAR(10000)                 ,
    log_timestamp TIMESTAMP                 ,
    description VARCHAR(100)                ,
    type VARCHAR(100)
);";
$result = pg_query($db, $query);

echo "Done.\n" . '</br>';

?>