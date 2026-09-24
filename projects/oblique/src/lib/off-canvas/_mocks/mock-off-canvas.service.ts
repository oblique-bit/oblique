import {Injectable} from '@angular/core';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockOffCanvasService {
	open = true;

	public readonly opened$ = of(true);
}
