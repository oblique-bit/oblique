import {AfterContentInit, Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {MatSelect} from '@angular/material/select';
import {Subject, takeUntil} from 'rxjs';
import {ObSelectPanelClassHelper} from './select-panel-class-helper';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-select',
	host: {class: 'ob-select'}
})
export class ObSelectDirective implements OnInit, AfterContentInit, OnDestroy {
	private readonly unsubscribe = new Subject<void>();
	private readonly host: HTMLElement;

	constructor(elRef: ElementRef, private readonly select: MatSelect) {
		this.host = elRef.nativeElement;
	}

	ngOnInit(): void {
		this.select.openedChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			ObSelectPanelClassHelper.ensureAdditionalClassesAreIncluded(this.host, this.select);
		});
	}

	ngAfterContentInit(): void {
		ObSelectPanelClassHelper.ensureAdditionalClassesAreIncluded(this.host, this.select);
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
