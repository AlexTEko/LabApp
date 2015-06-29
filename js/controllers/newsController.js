'use strict';
LabApp.controller('newsController', ['$scope', '$stateParams', 'ngAuthSettings', '$http', function ($scope, $stateParams, ngAuthSettings, $http) {
    if ($stateParams.category) {
        $http.get(ngAuthSettings.baseUrl + 'news=' + $stateParams.category).
            success(function (data, status, headers, config) {
                if (data) {
                    $scope.text = data;
                }
            }).
            error(function (data, status, headers, config) {

            });
    }
}]);

