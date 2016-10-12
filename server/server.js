var express = require('express'),
	cors = require('cors'),
	http = require('http'),
	bodyParser = require('body-parser');

// Context
// ------------------------------------
var context = {
	config: {
		auth:{
			secret: 'mlBI<y-PRVDA-jxPejzi0yLQU_1M_/FNO=1^?iO<YAv9J72a2FeDqPl6Y5@bY2yun%5Xu'
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
	port = 3000;

// Enable all CORS Requests:
app.use(cors());

// Use JSON body-parser to get POST data:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

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
app.use('/api/me',      require('./resources/me-resource')(auth));
app.use('/api/movies',  require('./resources/movies-resource')(auth));
app.use('/api/countries',  require('./resources/countries-resource')(auth));

// Debug only:
app.post('/api/logs', function (req, res) {
	console.log('[LOG] %s', JSON.stringify(req.body));
});

// Start server
// ------------------------------------
module.exports = app.listen(process.env.PORT || port, function () {
	console.log('Server listening at http://localhost:%s', port);

	// Seed some data:
	var data = {
		email: "eui@bit.admin.ch",
		password: auth.createHash("12345678"),
		firstname: "Oblique",
		lastname: "Reactive",
		roles: ["member", "admin"]
	};

	var User = require('./models/user');
	User.create(data).then(
		function(user) {
			console.log('[SEED]: Sample user created! [%s]', user);
		},
		function(err) {
			console.log('[SEED]: Unable to seed user! [data=%s, error=%s]', data, err);
		}
	);
});
