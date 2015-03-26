var express = require('express'),
	http = require('http'),
	bodyParser = require("body-parser"),
	extend = require('util')._extend;

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

app.use(function (req, res, next) {
	console.log('[API]: %s', req.url);
	next();
});

// Enable CORS from corsUrl:
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', corsUrl);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// RESTFul API definition
// ------------------------------------

var users = {
	'info@bit.admin.ch' : {
		email: 'info@bit.admin.ch'
	}
};

app.post('/api/auth/login', function (request, response) {
	var user = users[request.body.email];
	if(user) {
		response.send(user);
	} else {
		response.status(401).send();
	}
});


app.get('/api/movies', function (request, response) {
	response.send(movies.results);
});

// Debug only:
app.post('/api/log', function (req, res) {
	console.log('[API]: /log - %s', JSON.stringify(req.body));
});

// Start server
// ------------------------------------
module.exports = app.listen(port, function () {
	console.log('Server listening at http://localhost:%s', port);
});


// Dummy data
// ------------------------------------
var movies = {
	"page": 1,
	"results": [
		{
			"adult": false,
			"backdrop_path": "/hNFMawyNDWZKKHU4GYCBz1krsRM.jpg",
			"id": 550,
			"original_title": "Fight Club",
			"release_date": "1999-10-14",
			"poster_path": "/2lECpi35Hnbpa4y46JX0aY3AWTy.jpg",
			"popularity": 2.50307202280779,
			"title": "Fight Club",
			"video": false,
			"vote_average": 7.7,
			"vote_count": 3185
		},
		{
			"adult": false,
			"backdrop_path": "/qrZssI8koUdRxkYnrOKMRY3m5Fq.jpg",
			"id": 289732,
			"original_title": "Zombie Fight Club",
			"release_date": "2014-10-23",
			"poster_path": "/7k9db7pJyTaVbz3G4eshGltivR1.jpg",
			"popularity": 0.22494187847635,
			"title": "Zombie Fight Club",
			"video": false,
			"vote_average": 6,
			"vote_count": 1
		},
		{
			"adult": false,
			"backdrop_path": null,
			"id": 259016,
			"original_title": "Insane Fight Club",
			"release_date": "2014-03-11",
			"poster_path": "/mLhwBQPV3iATe3L61kbpmxANwL8.jpg",
			"popularity": 0.00772939662463474,
			"title": "Insane Fight Club",
			"video": false,
			"vote_average": 0,
			"vote_count": 0
		},
		{
			"adult": false,
			"backdrop_path": "/qw2Qb42xtyE1B449JoTgb1mVCe1.jpg",
			"id": 51021,
			"original_title": "Lure: Teen Fight Club",
			"release_date": "2010-11-16",
			"poster_path": "/aRTX5Y52yGbVL6TGnyI4E8jjtz4.jpg",
			"popularity": 0.00147857159303665,
			"title": "Lure: Teen Fight Club",
			"video": false,
			"vote_average": 2,
			"vote_count": 1
		},
		{
			"adult": false,
			"backdrop_path": "/tcoAGvTo96R7Y9ZGVCCz7BZvrvb.jpg",
			"id": 104782,
			"original_title": "Florence Fight Club",
			"release_date": "2010-01-01",
			"poster_path": "/eQqqu0srTYcclWqylvgpLyU87hV.jpg",
			"popularity": 0.00134182456962927,
			"title": "Florence Fight Club",
			"video": false,
			"vote_average": 0,
			"vote_count": 0
		},
		{
			"adult": false,
			"backdrop_path": null,
			"id": 289100,
			"original_title": "Girls Fight Club",
			"release_date": "2009-06-18",
			"poster_path": null,
			"popularity": 0.00115182449296259,
			"title": "Girls Fight Club",
			"video": false,
			"vote_average": 0,
			"vote_count": 0
		},
		{
			"adult": false,
			"backdrop_path": null,
			"id": 151912,
			"original_title": "Jurassic Fight Club",
			"release_date": "2008-10-22",
			"poster_path": "/AwECEjjen4eYSDZ3AETXnFG6dgu.jpg",
			"popularity": 0.000895714285736703,
			"title": "Jurassic Fight Club",
			"video": false,
			"vote_average": 0,
			"vote_count": 0
		},
		{
			"adult": false,
			"backdrop_path": null,
			"id": 295477,
			"original_title": "Fight club camp kusse",
			"release_date": "2005-08-12",
			"poster_path": "/5itVi2OcKAkTUK0xtVxueKURb1W.jpg",
			"popularity": 0.000428571428571429,
			"title": "Fight club camp kusse",
			"video": false,
			"vote_average": 0,
			"vote_count": 0
		},
		{
			"adult": false,
			"backdrop_path": null,
			"id": 209599,
			"original_title": "Brooklyn Girls Fight Club",
			"release_date": "",
			"poster_path": "/luWpP5WSw9JjbWS1J4BMnjkkJCX.jpg",
			"popularity": 9.12995954891524e-20,
			"title": "Brooklyn Girls Fight Club",
			"video": false,
			"vote_average": 3.5,
			"vote_count": 1
		},
		{
			"adult": false,
			"backdrop_path": null,
			"id": 115584,
			"original_title": "Fight Club – The “I am Jack’s Laryngitis” Edit",
			"release_date": "",
			"poster_path": null,
			"popularity": 1.49756512615769e-18,
			"title": "Fight Club – The “I am Jack’s Laryngitis” Edit",
			"video": false,
			"vote_average": 0,
			"vote_count": 0
		},
		{
			"adult": false,
			"backdrop_path": "/5Z0FScA1bB6EbdGmZCUBeUk32eV.jpg",
			"id": 14476,
			"original_title": "Clubbed",
			"release_date": "2009-01-16",
			"poster_path": "/ssIN8GQMSxz1DKMZUiJJlvdhmL4.jpg",
			"popularity": 0.263511039109753,
			"title": "Clubbed",
			"video": false,
			"vote_average": 7.1,
			"vote_count": 14
		},
		{
			"adult": false,
			"backdrop_path": "/kgAgwIqkGMjrvZ6H8rLOgh65f4.jpg",
			"id": 219897,
			"original_title": "Barrio Brawler",
			"release_date": "2013-08-27",
			"poster_path": "/8AyCFlw1d856UAAN21fnWOpQu4l.jpg",
			"popularity": 0.00016243682233513,
			"title": "Barrio Brawler",
			"video": false,
			"vote_average": 1.5,
			"vote_count": 2
		}
	],
	"total_pages": 1,
	"total_results": 12
};
