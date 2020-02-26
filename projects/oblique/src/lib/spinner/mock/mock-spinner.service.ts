import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObISpinnerEvent} from '../spinner-event';

@Injectable()
export class ObMockSpinnerService {
	static CHANNEL = 'default';

	get events(): Observable<ObISpinnerEvent> {
		return of({} as ObISpinnerEvent);
	}

	activate(channel?: string) {
	}

	deactivate(channel?: string) {
	}
}
