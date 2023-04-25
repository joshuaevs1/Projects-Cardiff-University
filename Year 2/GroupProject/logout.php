<?php

// Check if the user is logged in
if (!isset($_SESSION['username'])) {
    header('Location: login.php');
}

// Destroy the session
session_start();
session_unset();
session_destroy();
$_SESSION = [];

// Redirect to the index page
header('Location: index.php');
