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
            .when('/store', {
                templateUrl : '/html/store.html',
                controller  : 'storeController'
            })




    }])

angular.module('myApp')
	.controller('mainController', ['$scope', '$rootScope', '$http', '$location', 'authService', function($scope, $rootScope, $http, $location, authService) {

        authService.authCheck(function(user) {
            console.log(user)
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user
                 $rootScope.user = $scope.user

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

        $scope.drinkPotion = function() {
            if ($rootScope.user.HP < $rootScope.user.maxHP) {
                $rootScope.user.HP++
                $rootScope.user.potions--
            } else {
                alert('you are at full health')
            }
        }

	}])


angular.module('myApp')
    .controller('quest-masterController', ['$scope', '$rootScope', '$http',  '$location', 'authService', function($scope, $rootScope, $http, $location, authService) {

        // authService.authCheck(function(user) {
        //     if (!user) {
        //         console.log('no user, dude')
        //         $location.url('/')
        //     } else {
        //          $scope.user = user

        //     }
        // })
    $rootScope.user = $scope.user

        $scope.text = "come back for another quest when you are stronger"
       


        if ($rootScope.user.questNumber === 0 && $rootScope.user.dragonScales < 10) {
            $scope.text = "Greetings, new adventurer. I suspect you have come here to request a quest. Your first quest is this: bring me 10 dragon scales. You can find them scaly beasts in the Dragon Cave. You currently have: " + $rootScope.user.dragonScales + " dragon scales."
        } else if ($rootScope.user.dragonScales >= 10 && $rootScope.user.questNumber === 0) {
            $scope.text = "Thank you for the dragon scales. I can now weigh my oregano with more accuracy!!"
            $rootScope.user.questNumber++
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
    .controller('dragon-caveController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', function($scope, authService, $rootScope, $http, $location, $window) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user
                 $rootScope.user = $scope.user
            }
        })

        $scope.greeting = 'dragon cave bitch!'
        // console.log($rootScope.user)
        var Dragon = function() {
            this.name = "dragon"
            this.hp = 10 + Math.floor(Math.random() * 5)
            this.inventory = ['Dragon Scale']
            this.xp = this.hp * 1.5
            this.gold = (Math.floor(Math.random() * 6))
            this.attackPower = 2
        }

        $scope.dragon = new Dragon()
        console.log($scope.dragon)
        $scope.dragonShow = true
        $scope.text =  "You encounter a dragon. What do you want to do?"

        $scope.attack = function() {
            $scope.dragon.hp -= $rootScope.user.attackPower
            $rootScope.user.HP -= $scope.dragon.attackPower
            $scope.text = "You attack the dragon."
            
            if ($scope.dragon.hp <= 0) {
                $scope.dragonShow = false
                console.log('the dragon is dead')
                $rootScope.user.dragonScales++
                $rootScope.user.xp += $scope.dragon.xp
                $rootScope.user.gold += $scope.dragon.gold
                $scope.text = "The dragon is dead. You now have " + $rootScope.user.dragonScales + " dragon scales"

            }
            
            if ($rootScope.user.HP <= 0) {
                $scope.text = "you're dead"
            }

            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }

        $scope.run = function() {
            console.log('run')
            $location.url('/map')
        }

        $scope.deeper = function() {
            $scope.dragon = new Dragon()
            $window.location.reload()
            $location.url('/dragon-cave')
            

        }



  }])

angular.module('myApp')
    .controller('storeController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', function($scope, authService, $rootScope, $http, $location, $window) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user
                 $rootScope.user = $scope.user
            }
        })

        $scope.buyPotion = function() {
            $rootScope.user.potions++
            $rootScope.user.gold--

            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }
        $scope.hi = "yo bitch"

    }])





