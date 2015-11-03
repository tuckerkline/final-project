var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
var passport = require('passport')
var User = require('../Models/users.js')




/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/html/home.html', {root: './public'})
});


router.post('/signup', function(req, res){
    bcrypt.genSalt(10, function(error, salt){
        bcrypt.hash(req.body.password, salt, function(hashError, hash){
            var newUser = new User({
                username: req.body.username,
                password: hash,
            });
            newUser.save(function(saveErr, user){
                if ( saveErr ) { res.send({ err:saveErr }) }
                else { 
                    req.login(user, function(loginErr){
                        if ( loginErr ) { res.send({ err:loginErr }) }
                        else { res.send({success: 'success'}) }
                    })
                }
            })
            
        })
    })
})

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send({error : 'something went wrong :('}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({success:'success'});
        });
    })(req, res, next);
})

router.get('/me', function(req, res) {
    console.log(req.user)
    res.send(req.user)
})

router.get('/logout', function(req, res){
  req.logout();
  res.send('goodbye');
});

router.post('/me', function(req, res) {
	console.log(req.body)
    req.body.maxHP = 20 + (req.body.level * 3)
    req.body.maxMP = 10 + (req.body.level * 3)
    req.body.attackPower = req.body.level * 3

    if (req.body.MMS > 0) {
        req.body.attackPower += 2
    }

    if (req.body.HP < 0) {
        req.body.HP = 0
    }

	User.findOneAndUpdate({username : req.body.username}, req.body, function(error, data) {
		console.log(data)
        User.findOne({username : req.body.username}, function(error, data) {
            res.send(data)
        })
	})
})

router.get('/stackstats', function(req, res) {
    User.find({}).exec(function(err, docs) {
        res.send(docs)
    })    
})






module.exports = router;
