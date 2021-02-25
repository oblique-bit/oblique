import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable()
export class ObMockMasterLayoutComponentService {
	isMenuOpened = true;
	isFixed = true;
	hasCover = true;
	hasOffCanvas = true;
	hasMainNavigation = true;
	hasLayout = true;

	get configEvents(): Observable<ObIMasterLayoutEvent> {
		return of();
	}
}
