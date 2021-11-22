import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable()
export class ObMockMasterLayoutFooterService {
	isCustom = true;
	isSticky = false;
	hasLogoOnScroll = true;

	get configEvents$(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}
}
