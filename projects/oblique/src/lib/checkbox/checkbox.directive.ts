import {Directive, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-checkbox',
	standalone: true
})
export class ObCheckboxDirective implements OnInit, OnDestroy {
	private readonly $checked = new BehaviorSubject<boolean>(false);
	private readonly host: HTMLAnchorElement;
	private readonly rowCheckedClass = 'ob-table-row-checked';
	private readonly unsubscribe = new Subject<void>();

	constructor(
		elRef: ElementRef,
		private readonly checkbox: MatCheckbox,
		private readonly renderer: Renderer2
	) {
		this.host = elRef.nativeElement;
	}

	ngOnInit(): void {
		this.initializeChecked();
		this.monitorForCheckedChanges();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private conditionallyAdjustCheckedClassOnTableRows(checked: boolean): void {
		const row = this.host.closest(`.ob-table tr,.ob-table .mat-mdc-row`);

		if (row) {
			if (row.closest(`.${this.rowCheckedClass}`)) {
				if (!checked) {
					this.adjustCheckedClassOnTableRows(row, 'removeClass');
				}
			} else if (checked) {
				this.adjustCheckedClassOnTableRows(row, 'addClass');
			}
		}
	}
	private adjustCheckedClassOnTableRows(row: Element, addOrRemoveClass: 'addClass' | 'removeClass'): void {
		this.renderer[addOrRemoveClass](row, this.rowCheckedClass);

		if (row.closest('.mat-mdc-header-row')) {
			this.host
				.closest('.ob-table')
				.querySelectorAll('.mat-mdc-row')
				?.forEach(otherRow => {
					this.renderer[addOrRemoveClass](otherRow, this.rowCheckedClass);
				});
		}
	}

	private initializeChecked(): void {
		this.updateChecked(this.checkbox.checked);
	}

	private monitorForCheckedChanges(): void {
		this.checkbox.change.pipe(takeUntil(this.unsubscribe)).subscribe(change => this.updateChecked(change.checked));
		this.$checked.pipe(takeUntil(this.unsubscribe)).subscribe(checked => this.conditionallyAdjustCheckedClassOnTableRows(checked));
	}

	private updateChecked(checked: boolean): void {
		this.$checked.next(checked);
	}
}
