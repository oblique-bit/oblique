import {IRequestShortcutConfig} from './http-decorator';

export class ObliqueHttp {
	url:string;

	constructor(private $http:ng.IHttpService, CONFIG) {
		var url = document.URL.split(/.*\.html|#/i)[0];
		if (CONFIG.api.context) { // TODO: document this!
			this.url = url.split(CONFIG.api.context)[0];
		} else {
			this.url = url + CONFIG.api.path;
		}
	}

	get<T>(url:string, config?:IRequestShortcutConfig):ng.IPromise<T> {
		return this.withApiUrl<T>(this.$http.get, arguments);
	}

	delete<T>(url:string, config?:IRequestShortcutConfig):ng.IPromise<T> {
		return this.withApiUrl<T>(this.$http.delete, arguments);
	}

	head<T>(url:string, config?:IRequestShortcutConfig):ng.IPromise<T> {
		return this.withApiUrl<T>(this.$http.head, arguments);
	}

	/**
	 * From IHttpService
	 * @param url
	 * @param config
	 */
	jsonp<T>(url:string, config?:IRequestShortcutConfig):ng.IHttpPromise<T> {
		return this.withApiUrl<T>(this.$http.jsonp, arguments);
	}

	post<T>(url:string, data:any, config?:IRequestShortcutConfig):ng.IPromise<T> {
		return this.withApiUrl<T>(this.$http.post, arguments);
	}

	put<T>(url:string, data:any, config?:IRequestShortcutConfig):ng.IPromise<T> {
		return this.withApiUrl<T>(this.$http.put, arguments);
	}

	patch<T>(url:string, data:any, config?:IRequestShortcutConfig):ng.IPromise<T> {
		return this.withApiUrl<T>(this.$http.patch, arguments);
	}

	isApiCall(url:string):boolean {
		return url.indexOf(this.url) > -1;
	}

	private withApiUrl<T>(httpFunction, args):ng.IPromise<T> {
		let argsArray = [].slice.call(args);
		argsArray[0] = this.url + args[0];
		return httpFunction.apply(null, argsArray).then((response) => {
			// Unwrap API responses:
			return response.data;
		});
	}
}
