import {Injectable, inject} from '@angular/core';
import Cookies from 'js-cookie';
import {ObIsUserLoggedInPipe} from '../shared/is-user-logged-in.pipe';
import {ObEPamsEnvironment, ObLoginState} from '../service-navigation.model';
import {ObServiceNavigationTimeoutApiService} from '../api/service-navigation-timeout-api.service';
import {WINDOW} from '../../utilities';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';
import {ObServiceNavigationTimeoutCookieActivityService} from './service-navigation-timeout-cookie-activity.service';
import {ObServiceNavigationTimeoutRedirectorService} from './service-navigation-timeout-redirector.service';
import {ObServiceNavigationTimeoutReturnUrlService} from './service-navigation-timeout-return-url.service';

@Injectable()
export class ObServiceNavigationTimeoutService {
	public loginState: ObLoginState = 'SA';
	public logoutUrl: string;
	public rootUrl: string;
	private eportalUrl: string;
	private readonly logoutReminderCookieName = 'eportal-logout-reminder';
	private readonly timeoutCookieName = 'eportal-timeout';
	private readonly secondsFactor = 1000;
	private readonly isUserLoggedInPipe = new ObIsUserLoggedInPipe();
	private readonly window: Window = inject(WINDOW);
	private readonly timeoutApiService = inject(ObServiceNavigationTimeoutApiService);
	private readonly activityCookieService = inject(ObServiceNavigationTimeoutCookieActivityService);
	private readonly redirectorService = inject(ObServiceNavigationTimeoutRedirectorService);
	private readonly cookieService = inject(ObServiceNavigationTimeoutCookieService);
	private readonly returnUrlService = inject(ObServiceNavigationTimeoutReturnUrlService);

	public constructor() {
		this.redirectAfterLogout();

		this.setCookieDetector();

		this.tokenExpirationAndInactivityCheck();
	}

	public setUpEportalUrl(environment: ObEPamsEnvironment): void {
		this.eportalUrl = `https://eportal${environment}.admin.ch`;
	}

	/**
	 * If logout reminder cookie exist, do a redirection with its content.
	 *
	 * @remarks
	 * PAMS redirect to eportal after a logout. We want to display a timeout message and not only show eportal, therefore we need this cookie.
	 */
	private redirectAfterLogout(): void {
		const logoutReminderUrl = Cookies.get(this.logoutReminderCookieName);
		const noTimeoutInTheUrl = !this.window.location.href.includes('timeout=true');
		if (logoutReminderUrl && noTimeoutInTheUrl) {
			Cookies.remove(this.logoutReminderCookieName);
			this.window.location.href = logoutReminderUrl;
		}
	}

	/**
	 * When a logout/timeout cookie appears we do the redirection.
	 */
	private setCookieDetector(): void {
		let doesLogoutCookieExist = true;
		let doesTimeoutCookieExist = true;
		setInterval(() => {
			const logoutCheck = Cookies.get(this.redirectorService.logoutCookieName) !== undefined;
			const logoutCookieAppears = !doesLogoutCookieExist && logoutCheck;
			const isUserLoggedIn = this.isUserLoggedInPipe.transform(this.loginState, true);
			if (logoutCookieAppears && isUserLoggedIn) {
				this.redirectorService.redirectOrEmit(this.returnUrlService.getRedirectUrl('logout', this.eportalUrl));
			}

			doesLogoutCookieExist = logoutCheck;
			const timeoutCheck = Cookies.get(this.timeoutCookieName) !== undefined;
			const timeoutCookieAppears = !doesTimeoutCookieExist && timeoutCheck;
			if (timeoutCookieAppears) {
				this.redirectorService.redirectOrEmit(this.returnUrlService.getRedirectUrl('timeout', this.eportalUrl));
			}
			doesTimeoutCookieExist = timeoutCheck;
		}, this.secondsFactor);
	}

	/**
	 * @remark
	 * If you want to debug and manually activate the timeout, you can go in the developer panel and
	 * change manually the two cookie (pams-last-refresh, eportal-last-user-activity) by setting them to 0
	 */
	private tokenExpirationAndInactivityCheck(): void {
		const intervalCheckTime = 5;
		const seconds1minute = 60;

		setInterval(() => {
			const isUserLoggedIn = this.isUserLoggedInPipe.transform(this.loginState, true);
			if (!isUserLoggedIn) {
				return;
			}
			const cookieTime = +Cookies.get('pams-last-refresh') * this.secondsFactor;
			const expirationPamsWithoutMinute = cookieTime - seconds1minute * this.secondsFactor;
			const cookieWillExpire = Date.now() > expirationPamsWithoutMinute;

			if (cookieWillExpire) {
				this.checkIfUserIsInactive();
			}
		}, intervalCheckTime * this.secondsFactor);
	}

	private checkIfUserIsInactive(): void {
		const seconds29minute = 1740;
		const userLastActivity = +Cookies.get(this.activityCookieService.activityCookieName);
		const userIsInactive = Date.now() - userLastActivity > seconds29minute * this.secondsFactor;
		if (userIsInactive) {
			this.cookieService.setShortCookie(this.timeoutCookieName, this.window.location.href);
			this.cookieService.setCookie(this.logoutReminderCookieName, this.returnUrlService.getRedirectUrl('timeout', this.eportalUrl));
			this.redirectorService.redirectOrEmit(this.logoutUrl);
		} else {
			this.timeoutApiService.refreshPamsToken(this.rootUrl).subscribe();
		}
	}
}
