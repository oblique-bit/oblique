import {MovieService} from './movie-service';

export class MoviesController {
	query:string;
	movies:any[];

	/*@ngInject*/
	constructor(private movieService:MovieService,
	            $stateParams:ng.ui.IStateParamsService) {
		this.query = $stateParams['query'];
		this.movies = movieService.movies;
		this.reload();
	}

	reload() {
		this.movieService.reload();
	}
}
