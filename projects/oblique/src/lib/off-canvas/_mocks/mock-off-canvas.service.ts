import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class ObMockOffCanvasService {
	open = true;

	get opened(): Observable<boolean> {
		return of(true);
	}
}
