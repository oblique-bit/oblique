import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {ObEScrollMode, ObIMasterLayoutEvent} from '../master-layout.model';

@Injectable()
export class ObMockMasterLayoutNavigationService {
	isFullWidth = true;
	scrollMode = ObEScrollMode.AUTO;

	get configEvents$(): Observable<ObIMasterLayoutEvent> {
		return of({} as ObIMasterLayoutEvent);
	}

	get scrolled(): Observable<number> {
		return of(0);
	}

	get refreshed(): Observable<void> {
		return EMPTY;
	}

	refresh(): void {}

	scrollLeft(offset?: number): void {}

	scrollRight(offset?: number): void {}
}
