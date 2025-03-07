import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent} from '../master-layout.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockMasterLayoutFooterService {
	isCustom = true;
	isSticky = false;

	get configEvents$(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}
}
