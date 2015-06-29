'use strict';
LabApp.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        email: "",
        role: ""
    };


    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(ngAuthSettings.baseUrl + 'do=register', registration).then(function (response) {
            return response;
        });

    };

    var _login = function (loginData) {

        var deferred = $q.defer();

        $http.post(ngAuthSettings.baseUrl + 'do=login', loginData).success(function (data) {
            _authentication.isAuth = true;
            _authentication.email = loginData.email;
            localStorageService.set('authorizationData', {token: data.token, email: loginData.email});
            deferred.resolve(data);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.email = authData.email;
        }

    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;

}]);