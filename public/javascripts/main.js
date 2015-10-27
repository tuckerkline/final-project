angular.module('myApp', ['ngRoute'])


angular.module('myApp')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl : '/html/login.html',
                controller  : 'mainController'
            })
            .when('/map', {
                templateUrl : '/html/map.html',
                controller  : 'mainController'
            })




    }])

angular.module('myApp')
	.controller('mainController', ['$scope', '$http', function($scope, $http) {

        $scope.signup = function(){
            $http({
                method : 'POST',
                url    : '/signup',
                data   : $scope.signupForm
            }).then(function(returnData){
                console.log(returnData)
                 $scope.username = returnData.data.username
                if ( returnData.data.success ) { window.location.href="/home" }
               
            })
        }

        $scope.login = function(){
            $http({
                method : 'POST',
                url    : '/login',
                data   : $scope.loginForm
            }).then(function(returnData){
                if ( returnData.data.success ) { window.location.href="/home" } 
                else { console.log(returnData)}
            })
        }


	}])