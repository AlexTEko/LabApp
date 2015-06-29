'use strict';
LabApp.controller('signupController', ['$scope','$http','ngAuthSettings','$injector','$timeout', function ($scope,$http,ngAuthSettings,$injector,$timeout) {
    $scope.message = '';
    $scope.registration = {
        email: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function() {
        $http.post(ngAuthSettings.baseUrl + 'do=register', $scope.registration).success(function(data) {
            $scope.message = data.message;
            if (data.status ==  0) {
                $scope.message = 'Успешная регистрация. Через 5 секунд вы будете автоматически перенаправлены на страницу входа.';
                startTimer();
            }
        })
    }

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $injector.get('$state').go('login');
        }, 5000);
    }
}]);