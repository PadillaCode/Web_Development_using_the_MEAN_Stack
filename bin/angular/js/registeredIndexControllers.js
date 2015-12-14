var pageControllers = angular.module('RegisteredIndexControllers', []);

pageControllers.controller('RegisteredIndexHomeControllers', ['$scope', '$http', function ($scope, $http) {
    'use strict';
    $http.get('/api/userhandle')
        .then(function (response) {
            $scope.NameData = response.data;
        });
}]);

pageControllers.controller('RegisteredIndexAboutControllers', ['$scope', '$http', function ($scope, $http) {
    'use strict';
}]);