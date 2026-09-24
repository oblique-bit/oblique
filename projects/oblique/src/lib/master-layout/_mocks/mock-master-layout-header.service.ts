import {Injectable, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent, ObIServiceNavigationConfig} from '../master-layout.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockMasterLayoutHeaderService {
	isCustom = true;
	isMedium = true;
	isSticky = true;
	readonly serviceNavigationConfiguration = signal<ObIServiceNavigationConfig>({});
	loginState$ = of(false);

	updateServiceNavigationConfiguration(configuration: Partial<ObIServiceNavigationConfig>): void {
		this.serviceNavigationConfiguration.update(current => ({...current, ...configuration}));
	}

	get configEvents$(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}
}
