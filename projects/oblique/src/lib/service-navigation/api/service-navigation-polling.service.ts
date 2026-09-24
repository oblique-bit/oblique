import {Injectable, inject} from '@angular/core';
import {Observable, ReplaySubject, combineLatest, switchMap, throwError, timer} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {obPauseWhenPageHidden} from '../../rxjs-operators';
import {ObNotificationService} from '../../notification/notification.service';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';
import {ObServiceNavigationCountApiService} from './service-navigation-message-count-api.service';
import {ObIServiceNavigationState} from './service-navigation.api.model';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class ObServiceNavigationPollingService {
	readonly state$: Observable<ObIServiceNavigationState>;
	private readonly pollingDataState = new ReplaySubject<ObIServiceNavigationState>(1);
	private readonly stateApiService = inject(ObServiceNavigationStateApiService);
	private readonly countApiService = inject(ObServiceNavigationCountApiService);
	private readonly notification = inject(ObNotificationService);
	private hasError = false;

	constructor() {
		this.state$ = this.pollingDataState.asObservable();
	}

	initializeStateUpdate(
		stateInterval: number,
		countInterval: number,
		environmentUrl: string,
		favoriteApplicationCount: number
	): void {
		const secondsMultiplier = 1000;
		combineLatest([
			timer(0, stateInterval * secondsMultiplier).pipe(
				switchMap(() => this.stateApiService.get(environmentUrl, favoriteApplicationCount))
			),
			timer(0, countInterval * secondsMultiplier).pipe(switchMap(() => this.countApiService.get(environmentUrl))),
		])
			.pipe(
				map(results => ({...results[0], messageCount: results[1]})),
				obPauseWhenPageHidden(),
				retry({
					delay: (error: HttpErrorResponse) =>
						this.displayErrorAndReturnDelay(error, stateInterval * secondsMultiplier),
				})
			)
			.subscribe(result => {
				this.showIsBackNotification();
				this.pollingDataState.next(result);
			});
	}

	private displayErrorAndReturnDelay(error: HttpErrorResponse, delay: number): Observable<number> {
		if ([500, 0].includes(error.status)) {
			this.showErrorNotification();
			return timer(delay);
		}

		this.notification.error({
			message: 'i18n.oblique.service-navigation.state.error.message',
			title: 'i18n.oblique.service-navigation.state.error.title',
		});

		return throwError(() => new Error('Cannot load service navigation state'));
	}

	private showErrorNotification(): void {
		if (this.hasError === false) {
			this.hasError = true;
			this.notification.error({
				message: 'i18n.oblique.service-navigation.state.error.retry',
				title: 'i18n.oblique.service-navigation.state.error.title',
			});
		}
	}

	private showIsBackNotification(): void {
		if (this.hasError === true) {
			this.hasError = false;
			this.notification.success({
				message: 'i18n.oblique.service-navigation.state.is-back.message',
				title: 'i18n.oblique.service-navigation.state.is-back.title',
			});
		}
	}
}
