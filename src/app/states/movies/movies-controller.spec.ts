describe('MoviesControllerSuite', () => {

    let createController, $controller, movieServiceMock, $q, $scope;

    movieServiceMock = {
        reload: () => {
            let deferred = $q.defer();
            // Place the fake return object here
            deferred.resolve();
            return deferred.promise;
        }
    };

    createController = () => {
        return $controller('MoviesController', {
            MovieService: movieServiceMock,
            $scope: $scope
        });
    };

    beforeEach(angular.mock.module('__MODULE__.movies'));

    beforeEach(inject((_$controller_, $rootScope, _$q_) => {
        $controller = _$controller_;
        $q = _$q_;
        $scope = $rootScope.$new();
    }));

    it('has a MoviesController', () => {
        let moviesController = createController();
        expect(moviesController).not.toBeNull();
        expect(moviesController).toBeDefined();
    });

    it('should return a promise', () => {
        expect(movieServiceMock.reload().then).toBeDefined();
    });

    it('spy check', () => {
        spyOn(movieServiceMock, 'reload').and.callThrough();

        movieServiceMock.reload();

        expect(movieServiceMock.reload).toHaveBeenCalled();
    });
});