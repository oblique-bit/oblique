import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable()
export class ObMockOffCanvasService {
	open = true;

	public readonly opened$ = of(true);
}
