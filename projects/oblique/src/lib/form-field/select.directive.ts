import {AfterContentInit, Directive, OnDestroy, OnInit} from '@angular/core';
import {MatLegacySelect} from '@angular/material/legacy-select';
import {Subject, takeUntil} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-select',
	host: {class: 'ob-select'}
})
export class ObSelectDirective implements OnInit, AfterContentInit, OnDestroy {
	private readonly obSelectClass = 'ob-select';
	private readonly unsubscribe = new Subject<void>();

	constructor(private readonly select: MatLegacySelect) {}

	ngOnInit(): void {
		this.select.openedChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.ensureObSelectIsIncluded();
		});
	}

	ngAfterContentInit(): void {
		this.ensureObSelectIsIncluded();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private addObSelect(): void {
		if (this.select.panelClass) {
			if (typeof this.select.panelClass === 'string') {
				this.select.panelClass += ` ${this.obSelectClass}`;
			} else if (typeof this.select.panelClass === 'object') {
				if (Array.isArray(this.select.panelClass)) {
					this.select.panelClass.push(this.obSelectClass);
				} else if (this.select.panelClass instanceof Set<string>) {
					this.select.panelClass.add(this.obSelectClass);
				} else {
					this.select.panelClass = {...this.select.panelClass, [this.obSelectClass]: true};
				}
			}
		} else {
			this.select.panelClass = this.obSelectClass;
		}
	}

	private ensureObSelectIsIncluded(): void {
		if (!this.isObSelectIncluded()) {
			this.addObSelect();
		}
	}

	private isObSelectIncluded(): boolean {
		if (this.select.panelClass) {
			if (typeof this.select.panelClass === 'string') {
				return this.select.panelClass.includes(this.obSelectClass);
			} else if (typeof this.select.panelClass === 'object') {
				if (Array.isArray(this.select.panelClass)) {
					return this.select.panelClass.includes(this.obSelectClass);
				} else if (this.select.panelClass instanceof Set<string>) {
					return this.select.panelClass.has(this.obSelectClass);
				}

				return Object.keys(this.select.panelClass).includes(this.obSelectClass);
			}
		}

		return false;
	}
}
