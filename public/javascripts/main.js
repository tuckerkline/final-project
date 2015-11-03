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
    .service('levelService', ['$http', function($http){
        this.levelChecker = function(xp) {
             return Math.pow(xp, (1/5))     
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
            .when('/chat', {
                templateUrl : '/html/chat.html',
                controller  : 'chatController'
            })
            .when('/skill-master', {
                templateUrl : '/html/skill-master.html',
                controller  : 'skill-masterController'
            })
            .when ('/dino-nest', {
                templateUrl : '/html/dino-nest.html',
                controller  : 'dino-nestController'
            })
            .when('/inventory', {
                templateUrl : '/html/inventory.html',
                controller  : 'inventoryController'
            })
            .when('/skills', {
                templateUrl : '/html/skills.html',
                controller  : 'skillsController'
            })
            .when('/spooky-mansion', {
                templateUrl : '/html/spooky-mansion.html',
                controller  : 'spooky-mansionController'
            })


 

    }])

angular.module('myApp')
	.controller('mainController', ['$scope', '$rootScope', '$http', '$location', 'authService', function($scope, $rootScope, $http, $location, authService) {

        authService.authCheck(function(user) {
            // console.log(user)
            if (!user) {
                // console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user
                 $rootScope.user = $scope.user

            }
        })

        $http({
            method : 'GET',
            url    : '/stackstats',
        }).then(function(returnData){
            $scope.stackLeaderboard = returnData.data

            // console.log($scope.stackLeaderboard)
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
            if ($rootScope.user.HP < $rootScope.user.maxHP && $rootScope.user.potions > 0) {
                $rootScope.user.HP++
                $rootScope.user.potions--
            } else {
                alert("it doesn't work like that")
            }
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }

        $scope.drinkMPPotion = function() {
            if ($rootScope.user.MP < $rootScope.user.maxMP && $rootScope.user.MPpotions > 0) {
                $rootScope.user.MP++
                $rootScope.user.MPpotions--
            } else {
                alert("it doesn't work like that")
            }
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }



 // HOW TO ADD AN ITEM
        // $scope.ait = function() {
        //     $rootScope.user.inventory["Test Item"] = 1
        //     $http({
        //         method : 'POST',
        //         url    : '/me',
        //         data   : $scope.user
        //     }).then(function(returnData) {
        //         // no need for anything here
        //     })
        // }
	}])


angular.module('myApp')
    .controller('quest-masterController', ['$scope', '$rootScope', '$http',  '$location', 'authService', function($scope, $rootScope, $http, $location, authService) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user

            }
        })
    $rootScope.user = $scope.user

        $scope.text = "come back for another quest when you are stronger"
       


        if ($rootScope.user.questNumber === 0 && $rootScope.user.dragonScales < 10) {
            $scope.text = "Greetings, new adventurer. I suspect you have come here to request a quest. Your first quest is this: bring me 10 dragon scales. You can find them scaly beasts in the Dragon Cave. You currently have: " + $rootScope.user.dragonScales + " dragon scales."
        } else if ($rootScope.user.dragonScales >= 10 && $rootScope.user.questNumber === 0) {
            $scope.text = "Thank you for the dragon scales. I can now weigh my oregano with more accuracy!! Take 10 potions as well!"
            $rootScope.user.questNumber++
            $rootScope.user.potions += 10
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }

        if ($rootScope.user.questNumber === 1 && $rootScope.user.level > 2 && $rootScope.user.dinoEggs < 8) {
            $scope.text = "ahh. You have come back for another quest, I see! Well i was just about to make breakfast, but seem to be messageHistorysing some eggs. Can you grab me 8 dinosaur eggs from the dino nest? After breakfast we'll get to the real adventures eh? Can't adventure on an empty stomach, right, lol jk okay bye!!1! \n You currently have " + $rootScope.user.dinoEggs + " Dino Eggs!"
        } else if ($rootScope.user.questNumber === 1 && $rootScope.user.level > 1 && $rootScope.user.dinoEggs >= 8) {
            $scope.text = "Thank you, thank you, thank you, adventurer! You're such a sweetheart. Here, sit and eat some Dinomellette with me!"
            $rootScope.user.questNumber++
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }

        if ($rootScope.user.questNumber === 2 && $rootScope.user.level > 4 && $rootScope.user.ghastper === 0) {
            $scope.text = "Ah! Adventurer! You seem strong enough, finally (*rolls his eyes*). We are desperate need of help. We have lost our good friend Ghastper the Good Ghost. He got lost in the spooooooky mansion! Please, go save him."
        }

        if ($rootScope.user.questNumber === 2 && $rootScope.user.ghastper === 1) {
            $scope.text = "you did it! you saved Ghastper, my only lover."
        } 



    }])



angular.module('myApp')
    .controller('dragon-caveController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', 'levelService', '$route', function($scope, authService, $rootScope, $http, $location, $window, levelService, $route) {

        authService.authCheck(function(user) {
            if (!user) {
                console.log('no user, dude')
                $location.url('/')
            } else {
                 $scope.user = user
                 $rootScope.user = $scope.user
            }
        })

       



        console.log($rootScope.user)
        var Dragon = function() {
            this.name = "dragon"
            this.hp = 10 + Math.floor(Math.random() * 5)
            this.inventory = ['Dragon Scale']
            this.xp = Math.floor(this.hp * 1.5)
            this.gold = (Math.floor(Math.random() * 6))
            this.attackPower = 2
        }

        
    
        $rootScope.alive = true

        if ($rootScope.user.HP <= 0) {
            $rootScope.alive = false
        }

        $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))

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
                $rootScope.user.dragonScales++
                $rootScope.user.xp += $scope.dragon.xp

                $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))


                $rootScope.user.gold += $scope.dragon.gold
                $scope.text = "The dragon is dead. You gained " + $scope.dragon.gold + " gold. You now have " + $rootScope.user.dragonScales + " dragon scales"

            }
            
            if ($rootScope.user.HP <= 0) {
                $scope.text = "you're dead"
                // $scope.dragonShow = !$scope.dragonShow
                $rootScope.alive = false
            }

            if ($rootScope.user.MMS > 0) {
                $rootScope.user.MMS --
            }

            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })

           
        }

        
        $scope.hitHarder = function() {
            if($rootScope.user.skills[0] === 'Hit Harder (1 MP)' && $rootScope.user.MP > 0) {
                $rootScope.user.dragonScales++
                $scope.dragon.hp -= ($rootScope.user.attackPower * 1.5)
                $rootScope.user.HP -= $scope.dragon.attackPower
                $scope.text = "You hit the dragon. Hard."
                $rootScope.user.MP--

                
                if ($scope.dragon.hp <= 0) {
                    $scope.dragonShow = false
                    $rootScope.user.xp += $scope.dragon.xp
                    $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))
                    $rootScope.user.gold += $scope.dragon.gold
                    $scope.text = "The dragon is dead. You gained " + $scope.dragon.gold + " gold. You now have " + $rootScope.user.dragonScales + " dragon scales"
                }

                if ($rootScope.user.HP <= 0) {
                    $scope.text = "you're dead"
                    $scope.dragonShow = !$scope.dragonShow
                    $rootScope.alive = false
                }

                if ($rootScope.user.MMS > 0) {
                    $rootScope.user.MMS --
                }

                $http({
                    method : 'POST',
                    url    : '/me',
                    data   : $scope.user
                }).then(function(returnData) {
                    // no need for anything here
                })
            } else (alert("It doesn't work like that! (Do you have MP? Do you have the skill? DIDN'T THINK SO!!"))

        }


        $scope.run = function() {
            $location.url('/map')
        }

        $scope.deeper = function() {
                            
            $route.reload()
            
            

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
            if ($rootScope.user.gold > 0 ) {
                $rootScope.user.potions++
                $rootScope.user.gold--
            }

            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }


        $scope.buyMPpotion = function() {
            if ($rootScope.user.gold > 1) {
                $rootScope.user.MPpotions++
                $rootScope.user.gold -= 2
            }
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }

        $scope.buyUselessStack = function() {
            if ($rootScope.user.gold >= 1000) {
                $rootScope.user.inventory["Useless Stack"]++
                $rootScope.user.gold -= 1000
            }
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
    .controller('skill-masterController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', function($scope, authService, $rootScope, $http, $location, $window) {

        authService.authCheck(function(user) {
           if (!user) {
            console.log('no user, dude')
            $location.url('/')
            } else {
                $scope.user = user
                $rootScope.user = $scope.user

            }
        })

        $scope.text = "come back when you are stronger"
        $scope.level2 = false
        $scope.level3 = false
        $scope.hitharderbought = true
        $scope.makemestrongerbought = true

        if ( $rootScope.user.level >= 2 ) {
            $scope.level2 = true
            $scope.text = "Welcome, adventurer, I am Erich, the skill-master."
        }

        if( $rootScope.user.level >= 3) {
            $scope.level3 = true
            $scope.lvl3text = "Ah. Level 3. I hope Hit Harder has been treating you well. For level 3 I will teach you a buff! You use 'Make Me Stronger' to buff yourself for 10 attacks. It will make you hit harder!"
        }

        if ($rootScope.user.skills[0] === 'Hit Harder (1 MP)') {
            $scope.hitharderbought = false
            $scope.hithardertext = "You've bought Hit Harder already"
        }

        if ($rootScope.user.skills[1] === 'Make Me Stronger (2 MP)') {
            $scope.makemestrongerbought = false
            $scope.lvl3text = "You've bought Make Me Stronger already"
        }

        

        $scope.buyLevel2Skill = function() {
            $rootScope.user.skills.push('Hit Harder (1 MP)')
            $rootScope.user.gold -= 10
            $scope.text = "Congrats you've learned Hit Harder! Go hit someone harder!"
            $scope.hitharderbought = false
            $scope.hithardertext = "You've bought Hit Harder already"
            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })
        }


        $scope.buyLevel3Skill = function() {
            $rootScope.user.skills.push('Make Me Stronger (2 MP)')
            $rootScope.user.gold -= 20
            $scope.text = "congrats you've learned Make Me Stronger! Go be strong!"
            $scope.makemestrongerbought = false
            $scope.lvl3text = "you've bought Make Me Stronger already"
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
    .controller('chatController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', function($scope, authService, $rootScope, $http, $location, $window) {

        authService.authCheck(function(user) {
           if (!user) {
            console.log('no user, dude')
            $location.url('/')
            } else {
                $scope.user = user
                $rootScope.user = $scope.user
            }
        })

        $scope.chatMessage = ''
        $scope.loggedInUsers = []
        $scope.messageHistory = []
          

       

        // calling `io()` fires the `connection` event on the server
        var socket = io()
        socket.on('loggedInUsers', function(data){

            $scope.loggedInUsers = data
            
            $scope.$apply()
            console.log(data) 
        })
        socket.on('chatMessage', function(data){ 
            console.log('chat message? ', data)
            $scope.messageHistory.push(data)
            $scope.$apply()
        })
        socket.on('whisper', function(data){
            console.log(data.sender + ': ' + data.content)
        })

        $scope.sendMessage = function(event){ 
            if ( event.which === 13 ) {
                console.log('chatting!!')
                if ( $scope.chatMessage[0] != '/' ) {
                    socket.emit('chatMessage', $scope.chatMessage)
                }
                else {
                    var recipient = $scope.chatMessage.split(' ')[0].slice(1)
                    var content   = $scope.chatMessage.split(' ').slice(1).join(' ')
                    // var recipient = $scope.chatMessage
                    socket.emit('whisper', {
                        recipient:recipient,
                        content:content
                    })
                }
                $scope.chatMessage = ''
            }
        } 



    }])

angular.module('myApp')
     .controller('dino-nestController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', 'levelService', '$route', function($scope, authService, $rootScope, $http, $location, $window, levelService, $route) {

        authService.authCheck(function(user) {
           if (!user) {
            console.log('no user, dude')
            $location.url('/')
            } else {
                $scope.user = user
                $rootScope.user = $scope.user
            }
        })

        $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))

        $scope.text = "You run into a dino guarding some eggs."
        $scope.dinoShow = true
        $rootScope.alive = true

        if ($rootScope.user.HP <= 0) {
            $rootScope.alive = false
        }
        if ( $rootScope.user.HP < 0 ) {
            $rootScope.alive = false
        }

         var Dino = function() {
            this.name = "dino"
            this.hp = 14 + Math.floor(Math.random() * 3)
            this.xp = Math.floor(this.hp * 2)
            this.gold = (Math.floor(Math.random() * 11))
            this.attackPower = 4
        }

        $scope.dino = new Dino()

        $scope.attack = function() {
            
           
            $scope.dino.hp -= $rootScope.user.attackPower
            $rootScope.user.HP -= $scope.dino.attackPower
            $scope.text = "You attack the dino."
            
            if ($scope.dino.hp <= 0) {
                $scope.dinoShow = false
                $rootScope.user.dinoEggs++
                $rootScope.user.xp += $scope.dino.xp

                $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))


                $rootScope.user.gold += $scope.dino.gold
                $scope.text = "The Dino is dead. You gained " + $scope.dino.gold + " gold. You now have " + $rootScope.user.dinoEggs + " Dinosaur eggs for breakfast."

            }
            
            if ($rootScope.user.HP <= 0) {
                $scope.text = "you're dead"
                $scope.dinoShow = !$scope.dinoShow
                $rootScope.alive = false
            }

            if ($rootScope.user.MMS > 0) {
                $rootScope.user.MMS --
            }

            $http({
                method : 'POST',
                url    : '/me',
                data   : $scope.user
            }).then(function(returnData) {
                // no need for anything here
            })

           
        }

        $scope.hitHarder = function() {
            if($rootScope.user.skills[0] === 'Hit Harder (1 MP)' && $rootScope.user.MP > 0) {
                $rootScope.user.dinoEggs++
                $scope.dino.hp -= ($rootScope.user.attackPower * 1.5)
                $rootScope.user.HP -= $scope.dino.attackPower
                $scope.text = "You hit the dino. Hard."
                $rootScope.user.MP--
                
                if ($scope.dino.hp <= 0) {
                    $scope.dinoShow = false
                    $rootScope.user.xp += $scope.dino.xp
                    $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))
                    $rootScope.user.gold += $scope.dino.gold
                    $scope.text = "The Dino is dead. You gained " + $scope.dino.gold + " gold. You now have " + $rootScope.user.dinoEggs + " Dinosaur eggs for breakfast."
                }

                if ($rootScope.user.HP <= 0) {
                    $scope.text = "you're dead"
                    $scope.dinoShow = !$scope.dinoShow
                    $rootScope.alive = false
                }

                if ($rootScope.user.MMS > 0) {
                    $rootScope.user.MMS --
                }
 
                $http({
                    method : 'POST',
                    url    : '/me',
                    data   : $scope.user
                }).then(function(returnData) {
                    // no need for anything here
                })
            } else (alert("It doesn't work like that! (Do you have MP? Do you have the skill? DIDN'T THINK SO!!"))

        }

        $scope.run = function() {
            $location.url('/map')
        }

        $scope.deeper = function() {
            $route.reload()
        }




    }])


angular.module('myApp')
     .controller('inventoryController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', 'levelService', '$route', function($scope, authService, $rootScope, $http, $location, $window, levelService, $route) {

        authService.authCheck(function(user) {
           if (!user) {
            console.log('no user, dude')
            $location.url('/')
            } else {
                $scope.user = user
                $rootScope.user = $scope.user
            }
        })

        $scope.greeting = 'hi invetnory'

    }])

angular.module('myApp')
     .controller('skillsController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', 'levelService', '$route', function($scope, authService, $rootScope, $http, $location, $window, levelService, $route) {

        authService.authCheck(function(user) {
           if (!user) {
            console.log('no user, dude')
            $location.url('/')
            } else {
                $scope.user = user
                $rootScope.user = $scope.user
            }
        })

        $rootScope.MMSshow = false
        if ($rootScope.user.skills[1] === 'Make Me Stronger (2 MP)' ) {
            $rootScope.MMSshow = true
        }

        $scope.useMMS = function() {
            if ($rootScope.user.MP > 0) {
                $rootScope.user.MP -= 2
                $rootScope.user.MMS += 10

                $http({
                    method : 'POST',
                    url    : '/me',
                    data   : $scope.user
                }).then(function(returnData) {
                    // no need for anything here
                })
            } else {
                alert('You need more MP.')
            }

        }


    }])


angular.module('myApp')
     .controller('spooky-mansionController', ['$scope','authService', '$rootScope', '$http',  '$location', '$window', 'levelService', '$route', function($scope, authService, $rootScope, $http, $location, $window, levelService, $route) {

        authService.authCheck(function(user) {
           if (!user) {
            console.log('no user, dude')
            $location.url('/')
            } else {
                $scope.user = user
                $rootScope.user = $scope.user
            }
        })

        $rootScope.questNumber3 = true
        if ($rootScope.user.questNumber < 2) {
            $rootScope.questNumber3 = !$rootScope.questNumber3
        } 

        var ghastperNum = Math.floor(Math.random() * 7)
        var advNum = Math.floor(Math.random() * 7)

        $rootScope.ghastper = false
        $rootScope.badGhost = false
        if ($rootScope.alive === true) {
            $scope.text = "You see a ghost. It's a bad ghost."
        } else {
            $scope.text = "You're dead. Go fix that."
        }

        var Ghost = function() {
            this.name = "ghost"
            this.hp = 19 + Math.floor(Math.random() * 3)
            this.xp = Math.floor(this.hp * 2)
            this.gold = 15 + (Math.floor(Math.random() * 20))
            this.attackPower = 7
        }

        $scope.ghost = new Ghost()

        $rootScope.alive = true

        if ($rootScope.user.HP <= 0) {
            $rootScope.alive = false
        }

        $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))

        if (ghastperNum === advNum) {
            $rootScope.ghastper = true

        } 
        $scope.saveGhastper = function() {
                $rootScope.user.ghastper = 1
                $scope.ghastperText = 'You save Ghastper! Hooray!'
                $http({
                    method : 'POST',
                    url    : '/me',
                    data   : $scope.user
                }).then(function(returnData) {
                    // no need for anything here
                })
            }

        if (ghastperNum != advNum) {
            $rootScope.badGhost = true
            $scope.ghostShow = true
            console.log('no match')
            $scope.attack = function() {
           
                $scope.ghost.hp -= $rootScope.user.attackPower
                $rootScope.user.HP -= $scope.ghost.attackPower
                $scope.text = "You attack the ghost."
                
                if ($scope.ghost.hp <= 0) {
                    $scope.ghostShow = false

                    $rootScope.user.xp += $scope.ghost.xp

                    $rootScope.user.level = Math.floor(levelService.levelChecker($rootScope.user.xp))


                    $rootScope.user.gold += $scope.ghost.gold
                    $scope.text = "The ghost is dead. You gained " + $scope.ghost.gold + " gold."

                }
                
                if ($rootScope.user.HP <= 0 || $rootScope.alive === false) {
                    $scope.text = "you're dead"
                    // $scope.dragonShow = !$scope.dragonShow
                    $rootScope.alive = false
                }

                if ($rootScope.user.MMS > 0) {
                    $rootScope.user.MMS --
                }

                $http({
                    method : 'POST',
                    url    : '/me',
                    data   : $scope.user
                }).then(function(returnData) {
                    // no need for anything here
                })
        }
        }

        $scope.deeper = function() {
                            
            $route.reload()
            
            

        }




    }])


