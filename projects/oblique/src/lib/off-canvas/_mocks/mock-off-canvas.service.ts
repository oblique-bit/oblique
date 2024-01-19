import {Injectable} from '@angular/core';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockOffCanvasService {
	open = true;

	public readonly opened$ = of(true);
}
