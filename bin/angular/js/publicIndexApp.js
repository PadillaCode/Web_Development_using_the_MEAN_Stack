var publicApp;
publicApp = angular.module('publicIndexApp', [
    'ngRoute',
    'PublicIndexControllers'
]);

publicApp.config(['$routeProvider', function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/home', {
            templateUrl: '/angular/partials/publicHome.html',
            controller: 'PublicIndexHomeControllers'
        }).when('/about', {
            templateUrl: '/angular/partials/about.html'
        }).otherwise({
            redirectTo: '/home'
        });
}]);