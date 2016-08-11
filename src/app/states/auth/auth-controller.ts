import {AuthService} from '../../common/auth/auth-service';

export class AuthController {

    status = {
        authenticating: false,
        registering: false
    };

    user = {
        email: 'eui@bit.admin.ch',
        password: '12345678'
    };

    /*@ngInject*/
    constructor(private $state: ng.ui.IStateService,
                private authService: AuthService,
                private NotificationService) {
        //
    }

    // Properties --------------------------------------------------------------------------------------------------

    login() {
        this.status.authenticating = true;
        this.NotificationService.clear();
        this.authService.login(this.user).then(
            (user) => {
                this.$state.go('home').then(() => {
                    this.NotificationService.success('states.auth.login.success', `Welcome, ${user.firstname}!`);
                });
            }, (error) => {
                if (!error.defaultPrevented) {
                    this.NotificationService.error(error.data && error.data.message ? error.data.message : 'states.auth.login.error');
                }
            }
        ).finally(() => {
            this.status.authenticating = false;
        });
    };

    logout() {
        this.NotificationService.clear();
        this.authService.logout().then(() => {
            this.NotificationService.success('states.auth.logout.success');
            this.$state.go('home');
        }, (error) => {
            if (!error.defaultPrevented) {
                this.NotificationService.error(error.data && error.data.message || 'states.auth.logout.error');
            }
        });
    };

    register() {
        this.status.registering = true;
        this.NotificationService.clear();
        this.authService.register(this.user).then(() => {
            this.NotificationService.success('states.auth.register.success');
            this.$state.go('home');
        }, (error) => {
            if (!error.defaultPrevented) {
                this.NotificationService.error(error.data && error.data.message || 'states.auth.register.error');
            }
        }).finally(() => {
            this.status.registering = false;
        });
    };

}
