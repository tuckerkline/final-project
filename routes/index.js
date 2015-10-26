var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
var passport = require('passport')

var User = require('../Models/users.js')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/html/index.html', {root: './public'})
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


router.get('/home', function(req, res) {
  res.sendFile('/html/home.html', {root: './public'})
})

module.exports = router;
