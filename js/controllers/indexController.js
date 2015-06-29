'use strict';
LabApp.controller('indexController', ['$scope','$http','ngAuthSettings','$stateParams',function ($scope,$http,ngAuthSettings,$stateParams) {
    $http.get(ngAuthSettings.baseUrl + 'info=' + $stateParams.category).
        success(function(data, status, headers, config) {
            if (data) {
                $scope.text = data.text;
            }
        }).
        error(function(data, status, headers, config) {

        });
}]);
