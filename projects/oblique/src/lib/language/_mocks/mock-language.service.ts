import {Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable({
	providedIn: 'root',
})
export class ObMockLanguageService {
	readonly locale$ = of('en-GB');

	setDateLocale(adapter: DateAdapter<any>): void {}
}
