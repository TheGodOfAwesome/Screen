<?php

# Establish db connection
# $db = pg_connect(pg_connection_string($DB_NAME, $DB_DSN, $DB_PORT, $DB_USER, $DB_PASSWORD));

$db = pg_connect("host=localhost dbname=lore-events user=postgres password=donvinton") 
            or die('Could not connect: ' . pg_last_error());

// $db = pg_connect(getenv('DATABASE_URL'));

?>