var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'Pages/main.html',
            controller: 'mainController'
        })

        .when('/create', {
            templateUrl: 'Pages/create.html',
            controller: 'createController'
        })

        .when('/about', {
            templateUrl: 'Pages/about.html',
            controller: 'aboutController'
        })

        .when('/main', {
            templateUrl: 'Pages/main.html',
            controller: 'mainController'
        })


});

myApp.controller('mainController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    $scope.name = 'Main';


}]);

myApp.controller('createController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    $scope.name = 'Create';

    $scope.item = [];

    $http({
        method: 'GET',
        url: 'http://localhost:3000/route'
    }).then(function successCallback(response) {
        console.log('api response: ', response)

        $scope.items = response.data;

        // this callback will be called asynchronously
        // when the response is available
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $scope.data = [];
    $scope.submit = function () {
        console.log('clicked submit');
        $http({
            url: 'http://localhost:3000/'.append(encodeURI($scope.data.link)),
            method: 'GET',
            data: $scope.data
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
        })
    }

}]);

myApp.controller('aboutController', ['$scope', '$http', function ($scope, $http) {

    $scope.name = 'About';


}]);
