var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
// var jwt = require('jsonwebtoken');

var jwtSecret = 'fhsajdlkfhl$213%sdj';

var user = {
	username: 'elia',
	password: 'elia'
}

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/random-user', function(req, res) {
	var user = faker.helpers.userCard();
	user.avatar = faker.image.avatar();
	res.json(user);
});

app.post('/login', authenticate, function(req, res) {
	res.send({
		// token: jwt.sign({
		// 	username: username
		// }, jwtSecret),
		token: 'this is the static token',
		user: user
	}); 
});

app.listen(3000, function() {
	console.log('App listening on localhost:3000');
})



// UTIL FUNCTIONS
function authenticate(req, res, next) {
	var body = req.body;

	if(!body.username || !body.password) {
		res.status(400).end('Must provide username and password');
	} else if(body.username != user.username || body.password != user.password) {
		res.status(400).end('Invalid username and password');
	}

	next();
}