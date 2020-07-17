import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

// http://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
/**
 * @deprecated since version 5.1.0. This feature is not supported by Angular 10 and will be removed in Oblique 6.0.0
 */
export class ObUnsubscribable implements OnDestroy {
	protected unsubscribe: Subject<any> = new Subject();

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
