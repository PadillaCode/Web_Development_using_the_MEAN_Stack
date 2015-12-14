var privateApp;
privateApp = angular.module('registeredIndexApp', [
    'ngRoute',
    'RegisteredIndexControllers'
]);

privateApp.config(['$routeProvider', function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/home', {
            templateUrl: '/angular/partials/registeredHome.html',
            controller: 'RegisteredIndexHomeControllers'
        }).when('/about', {
            templateUrl: '/angular/partials/about.html',
            controller: 'RegisteredIndexAboutControllers'
        }).otherwise({
            redirectTo: '/home'
        });
}]);