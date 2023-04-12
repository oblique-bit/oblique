import {AfterContentInit, Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {MatSelect} from '@angular/material/select';
import {Subject, takeUntil} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-select',
	host: {class: 'ob-select'}
})
export class ObSelectDirective implements OnInit, AfterContentInit, OnDestroy {
	private readonly obSelectPanelClass = 'ob-select-panel';
	private readonly obSelectPanelSmallClass = `${this.obSelectPanelClass}-sm`;
	private readonly unsubscribe = new Subject<void>();
	private readonly host: HTMLAnchorElement;

	constructor(elRef: ElementRef, private readonly select: MatSelect) {
		this.host = elRef.nativeElement;
	}

	ngOnInit(): void {
		this.select.openedChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.ensureAdditionalClassesAreIncluded();
		});
	}

	ngAfterContentInit(): void {
		this.ensureAdditionalClassesAreIncluded();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private addClass(className: string): void {
		if (this.select.panelClass) {
			if (typeof this.select.panelClass === 'string') {
				this.select.panelClass += ` ${className}`;
			} else if (typeof this.select.panelClass === 'object') {
				if (Array.isArray(this.select.panelClass)) {
					this.select.panelClass.push(className);
				} else if (this.select.panelClass instanceof Set<string>) {
					this.select.panelClass.add(className);
				} else {
					this.select.panelClass = {...this.select.panelClass, [className]: true};
				}
			}
		} else {
			this.select.panelClass = className;
		}
	}

	private addObSelect(): void {
		this.addClass(this.obSelectPanelClass);
	}

	private addObSelectSmall(): void {
		this.addClass(this.obSelectPanelSmallClass);
	}

	private ensureAdditionalClassesAreIncluded(): void {
		this.ensureObSelectIsIncluded();
		this.ensureObSelectSmallIsIncluded();
	}

	private ensureObSelectIsIncluded(): void {
		if (!this.isObSelectIncluded()) {
			this.addObSelect();
		}
	}

	private ensureObSelectSmallIsIncluded(): void {
		if (this.isSmall() && !this.isObSelectSmallIncluded()) {
			this.addObSelectSmall();
		}
	}

	private isClassIncluded(className: string): boolean {
		if (this.select.panelClass) {
			if (typeof this.select.panelClass === 'string') {
				return this.select.panelClass.includes(className);
			} else if (typeof this.select.panelClass === 'object') {
				if (Array.isArray(this.select.panelClass)) {
					return this.select.panelClass.includes(className);
				} else if (this.select.panelClass instanceof Set<string>) {
					return this.select.panelClass.has(className);
				}

				return Object.keys(this.select.panelClass).includes(className);
			}
		}

		return false;
	}

	private isObSelectIncluded(): boolean {
		return this.isClassIncluded(this.obSelectPanelClass);
	}

	private isObSelectSmallIncluded(): boolean {
		return this.isClassIncluded(this.obSelectPanelSmallClass);
	}

	private isSmall(): boolean {
		return !!this.host.closest('.ob-form-sm') || !!this.host.closest('.mat-form-field-sm');
	}
}
