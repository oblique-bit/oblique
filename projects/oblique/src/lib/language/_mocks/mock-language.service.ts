import {Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable({
	providedIn: 'root',
})
export class ObMockLanguageService {
	readonly locale$ = of('en-GB');

	setDateLocale(adapter: DateAdapter<any>): void {}
}
