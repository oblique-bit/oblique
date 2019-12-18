import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {SpinnerEvent} from '../spinner-event';

@Injectable()
export class MockSpinnerService {
	static CHANNEL = 'default';

	get events(): Observable<SpinnerEvent> {
		return of({} as SpinnerEvent);
	}

	activate(channel?: string) {
	}

	deactivate(channel?: string) {
	}
}
