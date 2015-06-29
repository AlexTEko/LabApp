'use strict';
LabApp.controller('signupController', ['$scope', 'authService', 'ngAuthSettings', '$injector', '$timeout', function ($scope, authService, ngAuthSettings, $injector, $timeout) {
    $scope.message = '';
    $scope.savedSuccessfully = false;
    $scope.registration = {
        email: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function() {
        authService.saveRegistration($scope.registration).then(function (responce) {
            console.log(responce);
            $scope.message = responce.data.message;
            if (responce.data.status == 0) {
                $scope.savedSuccessfully = true;
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