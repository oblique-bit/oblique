import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, switchMap, timer} from 'rxjs';
import {ObIServiceNavigationState} from './service-navigation.api.model';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';

@Injectable({
	providedIn: 'root'
})
export class ObServiceNavigationPollingService {
	readonly state$: Observable<ObIServiceNavigationState>;
	private readonly pollingDataState = new ReplaySubject<ObIServiceNavigationState>(1);

	constructor(private readonly stateApiService: ObServiceNavigationStateApiService) {
		this.state$ = this.pollingDataState.asObservable();
	}

	initializeStateUpdate(stateInterval: number, environmentUrl: string): void {
		const secondsMultiplier = 1000;
		timer(0, stateInterval * secondsMultiplier)
			.pipe(switchMap(() => this.stateApiService.get(environmentUrl)))
			.subscribe(result => this.pollingDataState.next(result));
	}
}
