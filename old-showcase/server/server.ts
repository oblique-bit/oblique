let express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser');

// Context
// ------------------------------------
let context = {
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
let app = express(),
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
let auth = require('./security/auth')(context.config);

// RESTFul API definition
// ------------------------------------
app.use('/api/auth',    require('./resources/auth-resource')(auth));
app.use('/api/me',      require('./resources/me-resource')(auth));
app.use('/api/movies',  require('./resources/movies-resource')(auth));
app.use('/api/countries',  require('./resources/countries-resource')(auth));

// Debug only:
app.post('/api/logs', (req, res) => {
	console.log('[LOG] %s', JSON.stringify(req.body));

	// OK:
	res.send();
});

// Start server
// ------------------------------------
module.exports = app.listen(process.env.PORT || port, () => {
	console.log('Server listening at http://localhost:%s', port);

	// Seed some data:
	let User = require('./models/user');
	User.create(new User({
		email: 'eui@bit.admin.ch',
		password: auth.createHash('12345678'),
		firstname: 'Oblique',
		lastname: 'Reactive',
		roles: ['member', 'admin']
	})).then(
		function(user) {
			console.log('[SEED] Sample user created: ', user);
		},
		function(err) {
			console.log('[SEED] Unable to seed user: ', err);
		}
	);
});
