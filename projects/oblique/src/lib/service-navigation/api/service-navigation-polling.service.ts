import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, combineLatest, switchMap, throwError, timer} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {obPauseWhenPageHidden} from '../../rxjs-operators';
import {ObNotificationService} from '../../notification/notification.service';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';
import {ObServiceNavigationCountApiService} from './service-navigation-message-count-api.service';
import {ObIServiceNavigationState} from './service-navigation.api.model';

@Injectable({
	providedIn: 'root',
})
export class ObServiceNavigationPollingService {
	readonly state$: Observable<ObIServiceNavigationState>;
	private readonly pollingDataState = new ReplaySubject<ObIServiceNavigationState>(1);

	constructor(
		private readonly stateApiService: ObServiceNavigationStateApiService,
		private readonly countApiService: ObServiceNavigationCountApiService,
		private readonly notification: ObNotificationService
	) {
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
				catchError(() => {
					this.notification.error({
						message: 'i18n.oblique.service-navigation.state.error.message',
						title: 'i18n.oblique.service-navigation.state.error.title',
					});
					return throwError(() => new Error('Cannot load service navigation state'));
				})
			)
			.subscribe(result => this.pollingDataState.next(result));
	}
}
