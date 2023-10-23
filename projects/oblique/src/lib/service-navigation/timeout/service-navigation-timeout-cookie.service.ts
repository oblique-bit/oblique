import {Injectable, inject} from '@angular/core';
import Cookies from 'js-cookie';
import {WINDOW} from '../../utilities';

@Injectable()
export class ObServiceNavigationTimeoutCookieService {
	private readonly window: Window = inject(WINDOW);
	private readonly expirationIn1Hour = 3600;
	private readonly shortCookieLifeSpan = 5;

	public setShortCookie(key: string, value: string): void {
		this.setCookie(key, value, this.shortCookieLifeSpan);
	}

	public setCookie(key: string, value: string, expiration = this.expirationIn1Hour): void {
		Cookies.set(key, value, {
			expires: this.getDateInTheFuture(expiration),
			path: '/',
			domain: this.getDomainUrl(),
			secure: !this.isLocal(),
			sameSite: 'Strict'
		});
	}

	public deleteCookie(key: string): void {
		Cookies.remove(key, {
			path: '/',
			domain: this.getDomainUrl(),
			secure: !this.isLocal(),
			sameSite: 'Strict'
		});
	}

	private isLocal(): boolean {
		const currentUrl = this.window.location.href;
		const possibleLocalhostUrls = ['http://localhost:', 'http://127.0.0.1:'];
		return possibleLocalhostUrls.some(validUrl => currentUrl.startsWith(validUrl));
	}

	private getDomainUrl(): string {
		if (this.isLocal()) {
			return 'localhost';
		}

		const currentUrl = this.window.location.href;
		if (currentUrl.includes('.admin.ch')) {
			return '.admin.ch';
		}

		throw new Error('The Url is an unknown URL. Expect localhost or .admin.ch');
	}

	private getDateInTheFuture(seconds: number): Date {
		const secondsFactor = 1000;
		return new Date(Date.now() + seconds * secondsFactor);
	}
}
