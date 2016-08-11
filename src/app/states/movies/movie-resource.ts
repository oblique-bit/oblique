export class MovieResource {

    /*@ngInject*/
    constructor(private $http) {
        //
    }

    findAll() {
        return this.$http.api.get('/movies');
    }

    find(movieId) {
        return this.$http.api.get('/movies/' + movieId);
    }

    add(name, description, price) {
        return this.$http.api.post('/movies', {
            name: name,
            description: description,
            price: price
        });
    }

    save(movieId, name, description, price) {
        return this.$http.api.put('/movies/' + movieId, {
            name: name,
            description: description,
            price: price
        });
    }

    remove(movieId) {
        return this.$http.api.delete('/movies/' + movieId);
    }
}
