import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MasterLayoutEvent} from '../master-layout.utility';

@Injectable()
export class MockMasterLayoutComponentService {
	isMenuOpened = true;
	isFixed = true;
	hasCover = true;
	hasOffCanvas = true;
	hasMainNavigation = true;
	hasLayout = true;

	get configEvents(): Observable<MasterLayoutEvent> {
		return of();
	}
}
