import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class MockOffCanvasService {
	open = true;

	get opened(): Observable<boolean> {
		return of(true);
	}
}
