(function () {
    'use strict';
    describe("MoviesControllerSuite", function () {

        var createController, $controller, MovieServiceMock, $q, $scope;

        MovieServiceMock = {
            reload: function () {
                var deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve();
                return deferred.promise;
            }
        };

        createController = function () {
            return $controller('MoviesController', {
                MovieService: MovieServiceMock,
                $scope: $scope
            });
        };

        beforeEach(function () {
            module('__MODULE__.movies');
        });

        beforeEach(inject(function (_$controller_, $rootScope, _$q_) {
            $controller = _$controller_;
            $q = _$q_;
            $scope = $rootScope.$new();
        }));

        it('has a MoviesController', function () {
            var moviesController = createController();
            expect(moviesController).not.toBeNull();
            expect(moviesController).toBeDefined();
        });

        it('should return a promise', function () {
            expect(MovieServiceMock.reload().then).toBeDefined();
        });

        it('spy check', function () {
            spyOn(MovieServiceMock, 'reload').and.callThrough();

            MovieServiceMock.reload();

            expect(MovieServiceMock.reload).toHaveBeenCalled();
        });
    });
}());