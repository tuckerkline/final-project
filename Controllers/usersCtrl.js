var User = require('../Models/users')

var newUser = function(req, res) {
	var newUser = new User({	
		username : req.body.username,
		password : req.body.password
	})

	newUser.save(function(err, doc){
		res.send(doc)
	})
}

module.exports = {
	newUser = newUser,
}