export class MovieService {

	public movies:any[] = [];

	/*@ngInject*/
	constructor(private $http) {
	}

	reload() {
		return this.findAll().then((movies) => {
			angular.copy(movies, this.movies);
		});
	}

	findAll() {
		return this.$http.api.get('/movies');
	}

	find(movieId) {
		return this.$http.api.get('/movies/' + movieId);
	}

	add(movie) {
		return this.$http.api.post('/movies', movie);
	}

	save(movie) {
		return this.$http.api.put('/movies/' + movie.movieId, movie);
	}

	remove(movieId) {
		return this.$http.api.delete('/movies/' + movieId);
	}
}
