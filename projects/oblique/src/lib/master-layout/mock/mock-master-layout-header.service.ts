import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent} from '../master-layout.utility';

@Injectable()
export class ObMockMasterLayoutHeaderService {
	isCustom = true;
	isMedium = true;
	isAnimated = true;
	isSticky = true;
	hasScrollTransition = true;

	get configEvents(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}
}
