import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ObISpinnerEvent} from '../spinner.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockSpinnerService {
	static CHANNEL = 'default';

	get events(): Observable<ObISpinnerEvent> {
		return of({} as ObISpinnerEvent);
	}

	activate(channel?: string): void {}

	deactivate(channel?: string): void {}

	forceDeactivate(channel?: string): void {}
}
