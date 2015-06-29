'use strict';
LabApp.controller('adminController', ['$scope', '$stateParams', 'ngAuthSettings', '$http', '$injector', function ($scope, $stateParams, ngAuthSettings, $http, $injector) {
    $http.get(ngAuthSettings.baseUrl + 'do=admin').
        success(function (data, status, headers, config) {
            if (data) {
                if (data.status == 0)
                    if (data.admin != 1)
                        $injector.get('$state').go('login');
            }
        }).
        error(function (data, status, headers, config) {

        });
}]);