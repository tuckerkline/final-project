angular.module('myApp', ['ngRoute'])

angular.module('myApp')
    .service('authService', ['$http', function($http) {
        this.authCheck = function(cb) {
            $http.get('/me')
                .then (function(returnData) {
                    cb(returnData.data)
                })
        }


    }])


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
            .when('/profile', {
                templateUrl : '/html/profile.html',
                controller : 'mainController'
            })
            .when('/quest-master', {
                templateUrl : '/html/quest-master.html',
                controller  : 'mainController'
            })




    }])

angular.module('myApp')
	.controller('mainController', ['$scope', '$http', '$location', 'authService', function($scope, $http, $location, authService) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                console.log(user)
                 $scope.username = user.username

            }
        })


        $scope.signup = function(){
            $http({
                method : 'POST',
                url    : '/signup',
                data   : $scope.signupForm
            }).then(function(returnData){
                console.log(returnData)
                if ( returnData.data.success ) { 
                    $location.url("/map") 
                    
                }
               
            })
        }

        $scope.login = function(){
            $http({
                method : 'POST',
                url    : '/login',
                data   : $scope.loginForm
            }).then(function(returnData){
                if ( returnData.data.success ) { 
                    $location.url("/map") 

                } 
                else { console.log(returnData)}
            })
        }

        $scope.logout = function() {
            $http.get('/logout')
                .then(function(){
                    $location.url('/')
                })
        }


	}])







