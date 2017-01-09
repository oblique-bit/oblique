import {NotificationService} from 'oblique-reactive/../../../../../old-lib/oblique-reactive';

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
	constructor(private $state:ng.ui.IStateService,
	            private authService:AuthService,
	            private notificationService:NotificationService) {
		//
	}

	login(form) {
		if (form.$valid) {
			this.status.authenticating = true;
			this.notificationService.clear();
			this.authService.login(this.user).then(
				(user) => {
					this.$state.go('home').then(() => {
						this.notificationService.success('i18n.states.auth.login.success', `Welcome, ${user.firstname}!`);
					});
				}, (error) => {
					if (!error.defaultPrevented) {
						this.notificationService.error(error.data && error.data.message ? error.data.message : 'i18n.states.auth.login.error');
					}
				}
			).finally(() => {
				this.status.authenticating = false;
			});
		}
	};

	logout() {
		this.notificationService.clear();
		this.authService.logout().then(() => {
			this.notificationService.success('i18n.states.auth.logout.success');
			this.$state.go('home');
		}, (error) => {
			if (!error.defaultPrevented) {
				this.notificationService.error(error.data && error.data.message || 'i18n.states.auth.logout.error');
			}
		});
	};

	register(form) {
		if (form.$valid) {
			this.status.registering = true;
			this.notificationService.clear();
			this.authService.register(this.user).then(() => {
				this.notificationService.success('i18n.states.auth.register.success');
				this.$state.go('home');
			}, (error) => {
				if (!error.defaultPrevented) {
					this.notificationService.error(error.data && error.data.message || 'i18n.states.auth.register.error');
				}
			}).finally(() => {
				this.status.registering = false;
			});
		}
	};
}
