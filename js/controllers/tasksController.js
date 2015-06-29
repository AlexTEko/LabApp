'use strict';
LabApp.controller('tasksController', ['$scope', '$stateParams', 'ngAuthSettings', '$http', function ($scope, $stateParams, ngAuthSettings, $http) {
    $scope.tasks = [];

    if ($stateParams.category) {
        $http.get(ngAuthSettings.baseUrl + 'tasks=' + $stateParams.category).
            success(function (data, status, headers, config) {
                if (data) {
                    if (data.status == 0)
                        $scope.tasks = data.tasks;
                }
            }).
            error(function (data, status, headers, config) {

            });
    }
}]);

