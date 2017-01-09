import {ObliqueHttp} from './oblique-http';

//TODO: needs more refactoring
/*@ngInject*/
export function httpDecorator($delegate, CONFIG) {
	$delegate.api = new ObliqueHttp($delegate, CONFIG);
	return $delegate;
}

export interface HttpDecorator extends ng.IHttpService {
	api:ObliqueHttp;
}

export interface IRequestShortcutConfig extends ng.IRequestShortcutConfig {
	silent?:boolean;
	background?:boolean;
}

export interface IRequestConfig extends IRequestShortcutConfig {
	/**
	 * HTTP method (e.g. 'GET', 'POST', etc)
	 */
	method:string;
	/**
	 * Absolute or relative URL of the resource that is being requested.
	 */
	url:string;
}