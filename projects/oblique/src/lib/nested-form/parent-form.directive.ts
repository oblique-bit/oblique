import {Directive, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Directive({
	selector: '[obParentFormDirective]',
	standalone: true,
	host: {
		'(reset)': 'reset()',
		'(submit)': 'submit()',
		class: 'ob-parent-form-directive',
	},
	exportAs: 'obParentFormDirective',
})
export class ObParentFormDirective implements OnDestroy {
	public readonly submit$: Observable<void>;
	public readonly reset$: Observable<void>;
	private readonly submitSubject = new Subject<void>();
	private readonly resetSubject = new Subject<void>();

	constructor() {
		this.submit$ = this.submitSubject.asObservable();
		this.reset$ = this.resetSubject.asObservable();
	}

	ngOnDestroy(): void {
		this.submitSubject.complete();
		this.resetSubject.complete();
	}

	submit(): void {
		this.submitSubject.next();
	}

	reset(): void {
		this.resetSubject.next();
	}
}
