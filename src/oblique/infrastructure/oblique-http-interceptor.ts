import {HttpDecorator, IRequestConfig} from './oblique-http-decorator';
import {NotificationService} from '../notification/notification-service';
import {LoadingService} from '../loading/loading-service';

export class ObliqueHttpInterceptor implements ng.IHttpInterceptor {
	private log;

	/*@ngInject*/
	constructor(private $q:ng.IQService,
	            private $injector:ng.auto.IInjectorService,
	            private $rootScope:ng.IRootScopeService,
	            private notificationService:NotificationService,
	            private loadingService:LoadingService,
	            $log) {
		this.log = $log.getInstance('ObliqueHttpInterceptor');
	}


	request = (config:IRequestConfig) => {
		// TODO: redesign blocking/silent/background operations
		if (!ObliqueHttpInterceptor.isSilent(config) && !ObliqueHttpInterceptor.isBackground(config) && this.http().api.isApiCall(config.url)) {
			this.loadingService.start();
		}
		return config;
	};


	requestError = (rejection) => {
		return this.$q.reject(rejection);
	};


	response = <T>(response:ng.IHttpPromiseCallbackArg<T>) => {
		let $http = this.http();
		if (!ObliqueHttpInterceptor.isSilent(response.config) && !ObliqueHttpInterceptor.isBackground(response.config) && $http.api.isApiCall(response.config.url)) {
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
			if (!ObliqueHttpInterceptor.isSilent(rejection.config) && (rejection.status >= 500 || rejection.status === 0)) {
				// Mark this rejection as already handled:
				rejection.defaultPrevented = true;

				// Notify user:
				this.notificationService.error('i18n.oblique.error.http.status.' + rejection.status);
			}
		}
		this.log.error(rejection);
		return this.$q.reject(rejection);
	};


	private static isSilent(config:IRequestConfig) {
		return config && (config.silent || (config.data && config.data.silent));
	}


	private static isBackground(config:IRequestConfig) {
		return config && (config.background || (config.data && config.data.background));
	}

	// Others services are injected on demand in order to prevent circular dependency during factory creation:
	private http():HttpDecorator {
		return this.$injector.get<HttpDecorator>('$http');
	}
}
