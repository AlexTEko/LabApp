'use strict';

var LabApp = angular.module('LabApp', ['ui.router']);

LabApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/info');
    $stateProvider
        .state('info', {
            url: '/info',
            templateUrl: 'partial/partial-index.html',
            controller: 'indexController'
        });
});
