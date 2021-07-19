import {Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {of} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ObMockLanguageService {
	readonly locale$ = of('en-GB');

	setDateLocale(adapter: DateAdapter<any>): void {}
}
