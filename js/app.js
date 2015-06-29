'use strict';

var LabApp = angular.module('LabApp', ['ui.router', 'LocalStorageModule']);

LabApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('info', {
            url: '/info/:category',
            templateUrl: 'partial/partial-index.html',
            controller: 'indexController'
        })
        .state('login',{
            url: '/login',
            templateUrl: 'partial/partial-login.html',
            controller: 'loginController'
        })
        .state('register',{
            url: '/register',
            templateUrl: 'partial/partial-register.html',
            controller: 'signupController'
        });

});

LabApp.constant('ngAuthSettings',{baseUrl: 'http://lab.tekoone.ru/api/?'})

LabApp.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

LabApp.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});