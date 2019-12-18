import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {MasterLayoutEvent} from '../master-layout.utility';

@Injectable()
export class MockMasterLayoutNavigationService {
	isFullWidth = true;
	isScrollable = true;

	get configEvents(): Observable<MasterLayoutEvent> {
		return of({} as MasterLayoutEvent);
	}

	get scrolled(): Observable<number> {
		return of(0);
	}

	get refreshed(): Observable<void> {
		return EMPTY;
	}

	refresh(): void {
	}

	scrollLeft(offset?: number): void {
	}

	scrollRight(offset?: number): void {
	}
}
