import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable()
export class ObMockMasterLayoutHeaderService {
	isCustom = true;
	isMedium = true;
	isSticky = true;
	reduceOnScroll = true;
	serviceNavigationConfiguration = {};

	get configEvents$(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}
}
