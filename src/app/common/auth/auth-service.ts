export class AuthService {

    context = {
        user: null,
        roles: []
    };

    /*@ngInject*/
    constructor(private $http,
                private $q: ng.IQService,
                private $auth) {

    }
    
    init(user, roles) {
        this.context.user = user;
        this.context.roles = roles || [];
        return user;
    }
    
    destroy() {
        this.context.user = null;
        this.context.roles = [];
    }
    
    resolve() {
        // TODO: replace with your own user resolution implementation here!
        return this.$http.api.get('/me', {silent: true}).then((user) => {
            return this.init(user, user.roles);
        });
    }
    
    login(credentials) {
        // TODO: replace with your own login implementation here!
        // Make this a background request (TODO: redesign blocking/silent/background operations):
        credentials.background = true;
        return this.$auth.login(credentials).then(() => {
            return this.resolve();
        });
    }
    
    logout() {
        // TODO: replace with your own logout implementation here!
        return this.$auth.logout().then(() => {
            return this.destroy();
        });
    }
    
    register(user) {
        // TODO: replace with your own registration implementation here, if any!
        return this.$auth.signup(user).then((response) => {
            if (response.data && response.data.token) {
                this.$auth.setToken(response.data.token);
                return this.resolve();
            } else {
                return this.$q.reject('No authentication token returned!');
            }
        });
    }

    isAuthenticated() {
        // TODO: replace with your own authentication implementation here!
        return this.context.user && this.$auth.isAuthenticated();
    }
    
    isAuthorized(roles) {
        // TODO: replace with your own authorization implementation here!
        return this.isAuthenticated() && this.hasRoles(roles);
    }
    
    hasRoles(roles) {
        // TODO: replace with your own roles authorization implementation here!
        if (!angular.isArray(roles)) {
            roles = [roles];
        }
        return _.intersection(this.context.roles, roles).length > 0;
    }
}
