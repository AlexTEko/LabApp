'use strict';
LabApp.controller('indexController', ['$scope', '$http', 'authService', 'ngAuthSettings', '$stateParams', function ($scope, $http, authService, ngAuthSettings, $stateParams) {
    $scope.authentication = authService.authentication;

    if ($stateParams.category) {
        $http.get(ngAuthSettings.baseUrl + 'info=' + $stateParams.category).
            success(function (data, status, headers, config) {
                if (data) {
                    $scope.text = data.text;
                }
            }).
            error(function (data, status, headers, config) {

            });
    }

    $scope.logOut = function () {
        authService.logOut();
    }


}]);
