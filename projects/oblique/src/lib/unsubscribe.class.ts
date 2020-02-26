import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

// http://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
export class ObUnsubscribable implements OnDestroy {
	protected unsubscribe: Subject<any> = new Subject();

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
