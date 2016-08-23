import {MovieResource} from './movie-resource';

export class MovieService {

    public movies: any[] = [];

    /*@ngInject*/
    constructor(private movieResource: MovieResource) {
    }
    
    reload() {
        return this.movieResource.findAll().then((movies) => {
            angular.copy(movies, this.movies);
        });
    }

    add(movie) {
        return this.movieResource.add(movie.name, movie.description, movie.year);
    }

    save(movie) {
        return this.movieResource.save(movie.movieId, movie.name, movie.description, movie.year);
    }

    remove(movieId) {
        return this.movieResource.remove(movieId);
    }
}
