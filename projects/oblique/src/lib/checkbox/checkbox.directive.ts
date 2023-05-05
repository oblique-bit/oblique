import {Directive, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {MatLegacyCheckbox} from '@angular/material/legacy-checkbox';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-checkbox'
})
export class ObCheckboxDirective implements OnInit, OnDestroy {
	private readonly $checked = new BehaviorSubject<boolean>(false);
	private readonly host: HTMLAnchorElement;
	private readonly rowCheckedClass = 'ob-table-row-checked';
	private readonly unsubscribe = new Subject<void>();

	constructor(elRef: ElementRef, private readonly checkbox: MatLegacyCheckbox, private readonly renderer: Renderer2) {
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

	private adjustCheckedClassOnTableRow(checked: boolean): void {
		const row = this.host.closest(`.ob-table tr,.ob-table .mat-row`);
		if (row) {
			if (row.closest(`.${this.rowCheckedClass}`)) {
				if (!checked) {
					this.renderer.removeClass(row, this.rowCheckedClass);
				}
			} else if (checked) {
				this.renderer.addClass(row, this.rowCheckedClass);
			}
		}
	}
	private initializeChecked(): void {
		this.updateChecked(this.checkbox.checked);
	}

	private monitorForCheckedChanges(): void {
		this.checkbox.change.pipe(takeUntil(this.unsubscribe)).subscribe(change => this.updateChecked(change.checked));
		this.$checked.pipe(takeUntil(this.unsubscribe)).subscribe(checked => this.adjustCheckedClassOnTableRow(checked));
	}

	private updateChecked(checked: boolean): void {
		this.$checked.next(checked);
	}
}
