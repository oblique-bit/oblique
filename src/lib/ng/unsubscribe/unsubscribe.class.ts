import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';

// http://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
export class Unsubscribable implements OnDestroy {
	protected unsubscribe: Subject<void> = new Subject();

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
