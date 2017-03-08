import {HttpDecorator, IRequestConfig} from './http-decorator';
import {NotificationService} from '../ui/notifications/notification-service';
import {LoadingService} from '../status/loading-service';

export class HttpInterceptor implements ng.IHttpInterceptor {
	private log;

	/*@ngInject*/
	constructor(private $q:ng.IQService,
	            private $injector:ng.auto.IInjectorService,
	            private $rootScope:ng.IRootScopeService,
	            private notificationService:NotificationService,
	            private loadingService:LoadingService,
	            $log) {
		this.log = $log.getInstance('HttpInterceptor');
	}


	request = (config:IRequestConfig) => {
		// TODO: redesign blocking/silent/background operations
		if (!this.isSilent(config) && !this.isBackground(config) && this.http().api.isApiCall(config.url)) {
			this.loadingService.start();
		}
		return config;
	};


	requestError = (rejection) => {
		return this.$q.reject(rejection);
	};


	response = <T>(response:ng.IHttpPromiseCallbackArg<T>) => {
		let $http = this.http();
		if (!this.isSilent(config) && !this.isBackground(config) && $http.api.isApiCall(response.config.url)) {
			this.loadingService.stop();
		}
		return response;
	};

	responseError = (rejection) => {
		let $http = this.http();
		if ($http.api.isApiCall(rejection.config.url)) {
			this.loadingService.stop();
		}
		if (!this.$rootScope.$broadcast('$httpInterceptorError', rejection).defaultPrevented) {
			if (!this.isSilent(rejection.config) && (rejection.status >= 500 || rejection.status === 0)) {
				// Mark this rejection as already handled:
				rejection.defaultPrevented = true;

				// Notify user:
				this.notificationService.error('i18n.error.http.status.' + rejection.status);
			}
		}
		this.log.error(rejection);
		return this.$q.reject(rejection);
	};


	private isSilent(config:IRequestConfig) {
		return config && (config.silent || (config.data && config.data.silent));
	}


	private isBackground(config:IRequestConfig) {
		return config && (config.background || (config.data && config.data.background));
	}

	// Others services are injected on demand in order to prevent circular dependency during factory creation:
	private http():HttpDecorator {
		return this.$injector.get<HttpDecorator>('$http');
	}
}
