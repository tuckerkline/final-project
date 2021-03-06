var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();
var passport = require('passport')
var http = require('http').Server(app)


// view engine setup
app.set('views', path.join(__dirname, 'views'));


//mongoose
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/game')


var User = require('./Models/users.js')
/** Express Session Setup **/
var session = require('express-session')
app.sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
})
app.use(app.sessionMiddleware)
app.use(bodyParser.json())
/** Passport Config **/
var bcrypt = require('bcryptjs')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            // If we got this far, then we know that the user exists. But did they put in the right password?
            bcrypt.compare(password, user.password, function(error, response){
                if (response === true){
                    return done(null,user)
                }
                else {
                    return done(null, false)
                }
            })
        });
    }
));

app.isAuthenticated = function(req, res, next){
    // If the current user is logged in...
    if(req.isAuthenticated()){
    // Middleware allows the execution chain to continue.
        return next();
    }
    // If not, redirect to login
    res.redirect('/');
}


app.isAuthenticatedAjax = function(req, res, next){
    // If the current user is logged in...
    if(req.isAuthenticated()){
    // Middleware allows the execution chain to continue.
        return next();
    }
    // If not, redirect to login
    res.send({error:'not logged in'});
}

app.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send({error : 'something went wrong :('}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send({success:'success'});
        });
    })(req, res, next);
})






// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});





app.server = app.listen(3000, function (){
    console.log('go on...')
})



var io = require("socket.io")
var loggedInUsers = {}
var socketServer = io(app.server)

socketServer.use(function(socket, next){
    app.sessionMiddleware(socket.request, {}, next);
})

// socket servers can proactively emit messages for no reason!
// setInterval(function(){socketServer.emit('chatMessage',{content:'hi!'})},400)

// the `socket` object in the callback function represents the socket connection for a single user.
socketServer.on("connection", function(socket){
    // make sure the socket connection is authenticated.
    if ( socket.request.session && socket.request.session.passport && socket.request.session.passport.user ) {
        // this is our SERIALIZED user, a.k.a. just the user's mongo ID.
        var id = socket.request.session.passport.user
        User.findById(id, function(error, user){

            // console.log('socket user: ', user)
            loggedInUsers[user.username] = true;
            // console.log('whos logged in? ', loggedInUsers)
            socketServer.emit('loggedInUsers', loggedInUsers)


            socket.on('chatMessage', function(data){
                console.log('message to server!', data)
                socketServer.emit('chatMessage', {sender:user.username,content:data})

            })

            
            socket.join(user.username)
            socket.on('whisper', function(data){
                // console.log('whisper ', data)
                // console.log(loggedInUsers)
                socketServer.to(data.recipient).emit('whisper', {
                    sender  : user.username,
                    content : data.content
                })
            })

            socket.on('disconnect', function(){
                console.log('user disconnected');
                loggedInUsers[user.username] = false;
                socketServer.emit('loggedInUsers', loggedInUsers)

            });
        })
    }
})




module.exports = app;
