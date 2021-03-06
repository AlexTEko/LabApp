'use strict';
LabApp.controller('newsController', ['$scope', '$stateParams', 'ngAuthSettings', '$http', function ($scope, $stateParams, ngAuthSettings, $http) {
    $scope.news = [];

    if ($stateParams.category) {
        $http.get(ngAuthSettings.baseUrl + 'news=' + $stateParams.category).
            success(function (data, status, headers, config) {
                if (data) {
                    if (data.status == 0)
                        $scope.news = data.news;
                }
            }).
            error(function (data, status, headers, config) {

            });
    }
}]);

