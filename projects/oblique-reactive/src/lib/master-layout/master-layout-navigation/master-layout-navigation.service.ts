import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import {Unsubscribable} from '../../unsubscribe.class';
import {MasterLayoutService} from '../master-layout.service';

@Injectable({
	providedIn: 'root'
})
export class MasterLayoutNavigationService extends Unsubscribable {
	private readonly refreshedSubject: Subject<void> = new Subject<void>();
	private readonly refreshed$ = this.refreshedSubject.asObservable();
	private readonly scrollRightSubject: Subject<number> = new Subject<number>();
	private readonly scrolledRight$ = this.scrollRightSubject.asObservable();
	private readonly scrollLeftSubject: Subject<number> = new Subject<number>();
	private readonly scrolledLeft$ = this.scrollLeftSubject.asObservable();

	constructor(private readonly config: MasterLayoutService, translate: TranslateService) {
		super();
		translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.refresh());
	}

	get refreshed(): Observable<void> {
		return this.refreshed$;
	}

	get scrolledLeft(): Observable<number> {
		return this.scrolledLeft$;
	}

	get scrolledRight(): Observable<number> {
		return this.scrolledRight$;
	}

	refresh() {
		if (this.config.navigationScrollable) {
			// postpone the event emission so that Angular has time to apply changes to the DOM
			setTimeout(() => this.refreshedSubject.next());
		}
	}

	scrollLeft(offset?: number): void {
		if (this.config.navigationScrollable) {
			// postpone the event emission so that Angular has time to apply changes to the DOM
			setTimeout(() => this.scrollLeftSubject.next(offset));
		}
	}

	scrollRight(offset?: number): void {
		if (this.config.navigationScrollable) {
			// postpone the event emission so that Angular has time to apply changes to the DOM
			setTimeout(() => this.scrollRightSubject.next(offset));
		}
	}
}
