import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, combineLatest, switchMap, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';
import {ObServiceNavigationCountApiService} from './service-navigation-message-count-api.service';
import {ObIServiceNavigationState} from './service-navigation.api.model';

@Injectable({
	providedIn: 'root'
})
export class ObServiceNavigationPollingService {
	readonly state$: Observable<ObIServiceNavigationState>;
	private readonly pollingDataState = new ReplaySubject<ObIServiceNavigationState>(1);

	constructor(
		private readonly stateApiService: ObServiceNavigationStateApiService,
		private readonly countApiService: ObServiceNavigationCountApiService
	) {
		this.state$ = this.pollingDataState.asObservable();
	}

	initializeStateUpdate(stateInterval: number, countInterval: number, environmentUrl: string): void {
		const secondsMultiplier = 1000;
		combineLatest([
			timer(0, stateInterval * secondsMultiplier).pipe(switchMap(() => this.stateApiService.get(environmentUrl))),
			timer(0, countInterval * secondsMultiplier).pipe(switchMap(() => this.countApiService.get(environmentUrl)))
		])
			.pipe(map(results => ({...results[0], messageCount: results[1]})))
			.subscribe(result => this.pollingDataState.next(result));
	}
}
