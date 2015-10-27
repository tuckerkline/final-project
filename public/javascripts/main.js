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
                controller  : 'quest-masterController'
            })
            .when('/dragon-cave', {
                templateUrl : '/html/dragon-cave.html',
                controller  : 'dragon-caveController'
            })




    }])

angular.module('myApp')
	.controller('mainController', ['$scope', '$http', '$location', 'authService', function($scope, $http, $location, authService) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user

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


        $scope.addgold = function() {
            $scope.user.gold++
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }

	}])


angular.module('myApp')
    .controller('quest-masterController', ['$scope', '$http', '$location', 'authService', function($scope, $http, $location, authService) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user

            }
        })

        $scope.text = ""
        $scope.questNumber = 0

        if ($scope.questNumber === 0) {
            $scope.text = "Greetings, new adventurer. I suspect you have come here to request a quest. Your first quest is this: bring me 10 dragon scales. You can find them scaly beasts in the Dragon Cave"
        }



    }])



angular.module('myApp')
    .controller('dragon-caveController', ['$scope', '$http', '$location', 'authService', function($scope, $http, $location, authService) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user

            }
        })

        $scope.greeting = 'dragon cave bitch!'
        console.log($scope.user)
        var Dragon = function() {
            this.hp = 10 + Math.floor(Math.random * 5)
            this.inventory = ['Dragon Scale']
            this.xp = this.hp * 1.5
            this.gold = (Math.floor(Math.random * 6))
            this.attackPower = 2
        }

        var dragon = new Dragon()
        console.log(dragon)



  }])





