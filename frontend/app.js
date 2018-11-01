var myApp = angular.module('myApp', ['ngRoute']);


myApp.config(function ($routeProvider) {

    $routeProvider

        .when('/main', {
            templateUrl: 'Pages/main.html',
            controller: 'mainController'
        })

        .when('/second', {

            templateUrl: 'Pages/second.html',
            controller: 'secondController'

        })

});

myApp.controller('mainController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    $scope.name = 'Main';
    $scope.handle = '';

    $scope.lowercasehandle = function () {

        return $filter('lowercase')($scope.handle);

    }

    $scope.characters = 5;

    $scope.rules = [

        {
            rulename: "Must be 5 characters."
        },
        {
            rulename: "Must not be used elsewhere."
        },
        {
            rulename: "Must be cool."
        }

    ];


    /*$scope.$watch('handle', function(newValue, oldValue) {
        
        console.info('Changed!');
        console.log('Old:' + oldValue);
        console.log('New:' + newValue);
        
    });
    */


}]);

myApp.controller('secondController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    $scope.name = 'Second';

    $scope.lowercasehandle = function () {

        return $filter('lowercase')($scope.handle);

    }

    $scope.characters = 5;

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


}]);
