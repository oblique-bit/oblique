import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MasterLayoutEvent} from '../master-layout.utility';

@Injectable()
export class MockMasterLayoutFooterService {
	isCustom = true;
	isSmall = true;
	hasScrollTransition = true;

	get configEvents(): Observable<MasterLayoutEvent> {
		return of({} as MasterLayoutEvent);
	}
}
