//TODO: untested and needs refactoring

/*@ngInject*/
export function httpDecorator($delegate, CONFIG) {
	$delegate.api = $delegate.api || {};
	$delegate.api.url = (CONFIG.api.url || '') + CONFIG.api.context;

	$delegate.api.head = withApiUrl($delegate.head);
	$delegate.api.get = withApiUrl($delegate.get);
	$delegate.api.post = withApiUrl($delegate.post);
	$delegate.api.put = withApiUrl($delegate.put);
	$delegate.api.delete = withApiUrl($delegate['delete']);
	$delegate.api.patch = withApiUrl($delegate.patch);

	$delegate.api.isApiCall= (url) => {
		return url.indexOf($delegate.api.url) > -1;
	};

	return $delegate;

	function withApiUrl(httpFunction) {
		return function() : ng.IHttpPromise<any> {
			let args = [].slice.call(arguments);
			args[0] = $delegate.api.url + args[0];
			return httpFunction.apply(null, args).then((response) => {
				// Unwrap API responses:
				return response.data;
			});
		};
	}
}

export interface HttpDecorator extends ng.IHttpService {
	api: HttpService;
}

export interface HttpService extends ng.IHttpService {
	url : string;

	get<T>(url:string, config?:IRequestShortcutConfig):ng.IPromise<T>;

	delete<T>(url:string, config?:IRequestShortcutConfig):ng.IPromise<T>;

	head<T>(url:string, config?:IRequestShortcutConfig):ng.IPromise<T>;

	/**
	 * From IHttpService
	 * @param url
	 * @param config
	 */
	jsonp<T>(url:string, config?:IRequestShortcutConfig):ng.IHttpPromise<T>;

	post<T>(url:string, data:any, config?:IRequestShortcutConfig):ng.IPromise<T>;

	put<T>(url:string, data:any, config?:IRequestShortcutConfig):ng.IPromise<T>;

	patch<T>(url:string, data:any, config?:IRequestShortcutConfig):ng.IPromise<T>;

	isApiCall(url:string):boolean;
}

export interface IRequestShortcutConfig extends ng.IRequestShortcutConfig {
	silent?:boolean;
	background?:boolean;
}

export interface IRequestConfig extends IRequestShortcutConfig {
	/**
	 * HTTP method (e.g. 'GET', 'POST', etc)
	 */
	method: string;
	/**
	 * Absolute or relative URL of the resource that is being requested.
	 */
	url: string;
}