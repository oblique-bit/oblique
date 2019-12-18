import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {MasterLayoutEvent} from '../master-layout.utility';
import {ScrollMode} from '../master-layout.config';

@Injectable()
export class MockMasterLayoutNavigationService {
	isFullWidth = true;
	scrollMode = ScrollMode.AUTO;

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
