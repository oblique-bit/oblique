var express = require('express'),
	http = require('http'),
	bodyParser = require("body-parser"),
	extend = require('util')._extend;


// Context
// ------------------------------------
var context = {
	config: {
		auth:{
			secret: 'mlBI<y"jxPejzi0yLQU_1M_/FNO=1^?iO<YAv9J72a2FeDqPl6Y5@bY2yun%5Xu'
		}
	},
	users : {
		'info@bit.admin.ch' : {
			email: 'info@bit.admin.ch'
		}
	}
};

// Application server configuration
// ------------------------------------
var app = express(),
	corsUrl = 'http://localhost:9000',
	port = 3000;

// Use JSON body-parser to get POST data:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Enable CORS from corsUrl:
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', corsUrl);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, Origin, X-Requested-With');
	next();
});

app.use(function (req, res, next) {
	console.log('[API]: %s', req.url);
	next();
});

// Modules
// ------------------------------------

// Auth
var auth = require('./security/auth')(context.config);


// RESTFul API definition
// ------------------------------------
app.use('/api/auth',    require('./resources/auth-resource')(auth));
app.use('/api/me',    require('./resources/me-resource')(auth));
app.use('/api/movies',    require('./resources/movies-resource')(auth));

// Debug only:
app.post('/api/logs', function (req, res) {
	console.log('[LOG] %s', JSON.stringify(req.body));
});

// Start server
// ------------------------------------
module.exports = app.listen(port, function () {
	console.log('Server listening at http://localhost:%s', port);
});
