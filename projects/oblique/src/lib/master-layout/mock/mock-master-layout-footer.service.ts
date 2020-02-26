import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent} from '../master-layout.utility';

@Injectable()
export class ObMockMasterLayoutFooterService {
	isCustom = true;
	isSmall = true;
	hasScrollTransition = true;

	get configEvents(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}
}
