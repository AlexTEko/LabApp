'use strict';
LabApp.controller('loginController', ['$scope', 'authService', 'ngAuthSettings', '$injector', '$timeout', 'localStorageService', function ($scope, authService, ngAuthSettings, $injector, $timeout, localStorageService) {
    $scope.message = '';
    $scope.loginData = {
        email: "",
        password: ""
    };
    var state = $injector.get('$state');

    $scope.login = function () {
        authService.login($scope.loginData).then(function (response) {
                $scope.message = response.message;
                if (response.status == 0)
                    state.go('info');
            },
            function (err) {
                $scope.message = err.error_description;
            });
    }
}]);
