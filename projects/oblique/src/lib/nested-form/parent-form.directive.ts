import {Directive, HostListener, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Directive({
	selector: '[obParentFormDirective]',
	standalone: true,
	host: {class: 'ob-parent-form-directive'},
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

	@HostListener('submit') submit(): void {
		this.submitSubject.next();
	}

	@HostListener('reset') reset(): void {
		this.resetSubject.next();
	}
}
