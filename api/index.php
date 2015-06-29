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
    }