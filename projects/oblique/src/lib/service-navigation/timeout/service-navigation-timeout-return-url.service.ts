import {Injectable, inject} from '@angular/core';
import {WINDOW} from '../../utilities';

@Injectable()
export class ObServiceNavigationTimeoutReturnUrlService {
	private readonly window: Window = inject(WINDOW);

	public getRedirectUrl(key: 'logout' | 'timeout', eportalUrl: string): string {
		const url = new URL(this.window.location.href);
		const returnUrlParams = new URLSearchParams(url.search);
		const returnUrlKey = 'returnUrl';

		returnUrlParams.delete('logout');
		returnUrlParams.delete('timeout');
		returnUrlParams.delete(returnUrlKey);

		const urlWithoutTimeoutAndReturnUrlParameter = url.origin + url.pathname;
		const params = new URLSearchParams('');
		params.append(key, 'true');
		params.append(returnUrlKey, urlWithoutTimeoutAndReturnUrlParameter + this.addQuestionMarkWhenNotEmpty(returnUrlParams));

		const eportalUrlWithParameters = new URL(eportalUrl);
		eportalUrlWithParameters.search = params.toString();
		return eportalUrlWithParameters.href;
	}

	/**
	 * @remark
	 * WAF doesn't allow tailing question mark in GET variable
	 */
	private addQuestionMarkWhenNotEmpty(params: URLSearchParams): string {
		const questionMark = params.toString().length > 0 ? '?' : '';
		return questionMark + params.toString();
	}
}
