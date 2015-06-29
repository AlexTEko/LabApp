<?php
    include('config.php');
    header("Content-Type: application/json; charset=UTF-8");
    $conn = new mysqli(db_serv, db_user, db_pasw, db_name);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    if (isset($_GET['info'])) {
        $info = $_GET['info'];
        $result = $conn->query("SELECT text FROM info WHERE cat='$info' LIMIT 1");
        $res = $result->fetch_assoc();
        echo json_encode($res);
        exit();
    }

    if (isset($_GET['do'])) {
        if ($_GET['do'] == 'register') {
            $array = json_decode($HTTP_RAW_POST_DATA,true);
            //print_r($array);
            $login = trim($array['email']);
            $password = trim($array['password']);
            $password2 = trim($array['confirmPassword']);
            if (empty($login) or empty($password) or empty($password2)) {
                $res['status'] = '3';
                $res['message'] = 'Неверные данные';
                echo json_encode($res);
                exit();
            }
            if ($password != $password2) {
                $res['status'] = '1';
                $res['message'] = 'Пароли не совпадают';
                echo json_encode($res);
                exit();
            }
            if (strlen($password) < 6) {
                $res['status'] = '4';
                $res['message'] = 'Слишком короткий пароль (минимум 6 символов)';
                echo json_encode($res);
                exit();
            }
            $result = $conn->query("SELECT login FROM users WHERE login = '$login' LIMIT 1");
            if ($result->num_rows != 0) {
                $res['status'] = '2';
                $res['message'] = 'Такой пользователь уже зарегистрирован';
                echo json_encode($res);
                exit();
            }
            $password = md5(md5($password).pass_salt);
            $result = $conn->query("INSERT INTO users(login, password) VALUES ('$login','$password')");
            if ($result) {
                $res['status'] = '0';
                $res['message'] = 'Успешная регистрация';
                echo json_encode($res);
                exit();
            }
        }
        if ($_GET['do'] == 'login') {
            $array = json_decode($HTTP_RAW_POST_DATA, true);
            $login = trim($array['email']);
            $password = trim($array['password']);
            if (empty($login) or empty($password)) {
                $res['status'] = '3';
                $res['message'] = 'Неверные данные';
                echo json_encode($res);
                exit();
            }
            $result = $conn->query("SELECT login FROM users WHERE login = '$login' LIMIT 1");
            if ($result->num_rows == 0) {
                $res['status'] = '2';
                $res['message'] = 'Такой пользователь не зарегистрирован';
                echo json_encode($res);
                exit();
            }
            $password = md5(md5($password) . pass_salt);
            $result = $conn->query("SELECT login FROM users WHERE login = '$login' AND password = '$password' LIMIT 1");
            if ($result->num_rows == 0) {
                $res['status'] = '4';
                $res['message'] = 'Неверный пароль';
                echo json_encode($res);
                exit();
            }
            if ($result->num_rows == 1) {
                $token = bin2hex(openssl_random_pseudo_bytes(32));
                $result = $conn->query("UPDATE users SET date_login = NOW(),token = '$token '  WHERE login = '$login'");
                $res['status'] = '0';
                $res['message'] = 'Успешная авторизация';
                $res['token'] = $token;
                echo json_encode($res);
                exit();
            }
        }

    }

if (isset($_GET['news'])) {
    if ($_GET['news'] == 'private') {
        if (validateToken()) {
            $token = $_SERVER['HTTP_AUTHORIZATION'];
            $result = $conn->query("SELECT id FROM users WHERE token = '$token'");
            $id = $result->fetch_assoc()['id'];
            $result = $conn->query("SELECT subs_id FROM subs WHERE user_id=$id");
            $news = [];
            while ($row = $result->fetch_assoc()) {
                $id = $row['subs_id'];
                $result2 = $conn->query("SELECT header,text,common FROM news WHERE user_id=$id");
                while ($array = $result2->fetch_assoc()) {
                    $news[] = $array;
                }
            }
            $res['status'] = 0;
            $res['news'] = $news;
            echo json_encode($res);
        } else
            echo json_encode('false');

    } else {
        $result = $conn->query("SELECT header,text,common FROM news WHERE common=1");
        $news = [];
        while ($array = $result->fetch_assoc()) {
            $news[] = $array;
        }
        $res['status'] = 0;
        $res['news'] = $news;
        echo json_encode($res);
    }
}

if (isset($_GET['tasks'])) {
    if ($_GET['tasks'] == 'actual') {
        $result = $conn->query("SELECT header,text FROM tasks WHERE actual=1");
        $tasks = [];
        while ($array = $result->fetch_assoc()) {
            $tasks[] = $array;
        }
        $res['status'] = 0;
        $res['tasks'] = $tasks;
        echo json_encode($res);
    } else {
        $result = $conn->query("SELECT header,text FROM tasks");
        $tasks = [];
        while ($array = $result->fetch_assoc()) {
            $tasks[] = $array;
        }
        $res['status'] = 0;
        $res['tasks'] = $tasks;
        echo json_encode($res);
    }

}

function validateToken()
{
    global $conn;
    $token = $_SERVER['HTTP_AUTHORIZATION'];
    $result = $conn->query("SELECT token FROM users WHERE token = '$token' LIMIT 1");
    if ($result->num_rows == 1) {
        return true;
    }
    return false;
}