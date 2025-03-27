import {Injectable, inject} from '@angular/core';
import {WINDOW} from '../../utilities';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable()
export class ObServiceNavigationTimeoutRedirectorService {
	public handleLogout = true;
	public logoutUrl: string;
	public readonly logoutCookieName = 'eportal-logout';
	public readonly logoutTrigger$: Observable<string>;
	private emitOnlyOnceFlag = true;
	private isLogoutClicked = false;
	private readonly window: Window = inject(WINDOW);
	private readonly cookieService = inject(ObServiceNavigationTimeoutCookieService);
	private readonly logoutTriggeredSubject = new ReplaySubject<string>(1);

	constructor() {
		this.logoutTrigger$ = this.logoutTriggeredSubject.asObservable();
	}

	public shouldRedirect(): boolean {
		return !this.isLogoutClicked;
	}

	public logout(): void {
		this.isLogoutClicked = true;
		this.cookieService.setShortCookie(this.logoutCookieName, this.window.location.href);

		this.redirectOrEmit(this.logoutUrl);
	}

	public emitLogoutUrl(url: string): void {
		if (this.emitOnlyOnceFlag) {
			this.emitOnlyOnceFlag = false;
			this.logoutTriggeredSubject.next(url);
		}
	}

	public redirectOrEmit(href: string): void {
		if (this.handleLogout) {
			this.window.location.href = href;
		} else {
			this.emitLogoutUrl(href);
		}
	}
}
