import {Injectable, inject} from '@angular/core';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {merge, throttleTime} from 'rxjs';
import {ObServiceNavigationTimeoutCookieService} from './service-navigation-timeout-cookie.service';

@Injectable()
export class ObServiceNavigationTimeoutCookieActivityService {
	public readonly activityCookieName = 'eportal-last-user-activity';
	private readonly globalEventService = inject(ObGlobalEventsService);
	private readonly cookieService = inject(ObServiceNavigationTimeoutCookieService);

	public constructor() {
		merge(
			this.globalEventService.wheel$,
			this.globalEventService.mouseMove$,
			this.globalEventService.click$,
			this.globalEventService.keyDown$
		)
			.pipe(throttleTime(2000))
			.subscribe(() => {
				this.refreshActivity();
			});
	}

	private refreshActivity(): void {
		this.cookieService.setCookie(this.activityCookieName, Date.now().toString());
	}
}
