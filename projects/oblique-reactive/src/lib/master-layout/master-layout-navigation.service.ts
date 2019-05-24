import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

import {Unsubscribable} from '../unsubscribe.class';
import {MasterLayoutService} from '../master-layout/master-layout.service';

@Injectable({
	providedIn: 'root'
})
export class MasterLayoutNavigationService extends Unsubscribable {
	private readonly refreshedSubject: Subject<void> = new Subject<void>();
	private readonly refreshed$ = this.refreshedSubject.asObservable();

	constructor(private readonly config: MasterLayoutService, translate: TranslateService) {
		super();
		translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.refresh());
	}

	get refreshed(): Observable<void> {
		return this.refreshed$;
	}

	refresh() {
		if (this.config.navigationScrollable) {
			this.refreshedSubject.next();
		}
	}
}
