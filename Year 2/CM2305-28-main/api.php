<?php

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Request function to call the NodeJS API
function request($route, $post_params = null, $get_params = null)
{
    $req_url = 'localhost:3001'.$route;

    if (null != $post_params) {
        $query = http_build_query($post_params, '', '&');
        $data_json = json_encode($_POST);
    }

    if (null != $get_params) {
        $query = http_build_query($get_params, '', '&');
        $req_url = $req_url.'/'.$query;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $req_url);
    if (null != $post_params) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
        ]);
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($ch);
    $response = json_decode($result);
    curl_close($ch);

    return $response;
}

// Register a new user
if (isset($_POST['register']) && !empty($_POST['register'])) {
    $params = [
        'username' => $_POST['username'],
        'password' => $_POST['password'],
        'confirm_password' => $_POST['confirm_password'],
    ];
    $response = request('/auth/register', $post_params = $params);

    if (1 == $response->success) {
        header('Location: login.php');
        echo 'Account created succesfully.';
    } else {
        echo 'Failed to register.';
    }
}

// Login a user
if (isset($_POST['login']) && !empty($_POST['login'])) {
    $params = [
        'username' => $_POST['username'],
        'password' => $_POST['password'],
    ];
    $response = request('/auth/login', $post_params = $params);

    if (1 == $response->success) {
        session_start();
        $_SESSION['username'] = $response = ['username'];
        header('Location: dashboard.php');
        echo 'Login succesful.';
    } else {
        echo 'Login failed.';
    }
}
