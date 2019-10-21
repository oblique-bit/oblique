import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MasterLayoutEvent} from '../master-layout.utility';

@Injectable()
export class MockMasterLayoutHeaderService {
	isCustom = true;
	isMedium = true;
	isAnimated = true;
	isSticky = true;
	hasScrollTransition = true;

	get configEvents(): Observable<MasterLayoutEvent> {
		return of({} as MasterLayoutEvent);
	}
}
