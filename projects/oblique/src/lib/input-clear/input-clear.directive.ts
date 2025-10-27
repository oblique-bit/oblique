import {DestroyRef, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, inject} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {AbstractControl, NgModel} from '@angular/forms';
import {WINDOW} from '../utilities';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {fromEvent, startWith} from 'rxjs';

@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear',
	host: {class: 'ob-input-clear'},
	standalone: true
})
export class ObInputClearDirective implements OnInit {
	@Input('obInputClear') control: AbstractControl | HTMLInputElement | NgModel;
	@Input() focusOnClear = true;
	@Input() datePickerRef: MatDatepicker<unknown>;
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onClear = new EventEmitter<MouseEvent>();
	@HostBinding('class.ob-text-control-clear') cssClass = true;

	private readonly element = inject(ElementRef);
	private readonly validControlTypes = [AbstractControl, HTMLInputElement, NgModel];
	private readonly window: Window = inject(WINDOW);
	private readonly destroyRef = inject(DestroyRef);

	constructor() {
		// ensure matInput got resolved beforehand
		this.window.setTimeout(() => {
			this.addParentClass('ob-text-control');
		});
	}

	ngOnInit(): void {
		this.checkControlType();
		this.subscribeToInputValueChange();
	}

	@HostListener('click', ['$event'])
	onClick($event: MouseEvent): void {
		this.clearDatePicker();
		this.clearInputField();
		this.setFocus();
		this.onClear.next($event);
	}

	private checkControlType(): void {
		if (this.isInvalidControlType()) {
			const inputTypes = this.validControlTypes
				.map(validControlType => validControlType.name)
				.reduce((previous, current) => `${previous}, ${current}`);
			console.warn(
				`${ObInputClearDirective.name}: illegal value for obInputClear Input, please use one of the following: [${inputTypes}].`
			);
		}
	}

	private clearDatePicker(): void {
		if (this.datePickerRef) {
			this.datePickerRef.select(undefined);
		}
	}

	private subscribeToInputValueChange(): void {
		if (this.control instanceof AbstractControl) {
			this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef), startWith(this.control.value)).subscribe(value => {
				this.handleParentClass(value);
			});
		}

		if (this.control instanceof NgModel) {
			this.control.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef), startWith(this.control.value)).subscribe(value => {
				this.handleParentClass(value);
			});
		}

		if (this.control instanceof HTMLInputElement) {
			fromEvent(this.control, 'keyup')
				.pipe(takeUntilDestroyed(this.destroyRef), startWith(this.control.value))
				.subscribe(() => this.handleParentClass(this.control.value));
		}
	}

	private clearInputField(): void {
		this.clearReactiveForm();
		this.clearTemplateDrivenForm();
		this.clearHtmlInput();
	}

	private clearReactiveForm(): void {
		if (this.control instanceof AbstractControl) {
			this.control.patchValue(null);
		}
	}

	private clearTemplateDrivenForm(): void {
		if (this.control instanceof NgModel) {
			this.control.control.patchValue(null);
		}
	}

	private clearHtmlInput(): void {
		if (this.control instanceof HTMLInputElement) {
			this.control.value = '';
		}
	}

	private isInvalidControlType(): boolean {
		return this.validControlTypes
			.map(validControlType => !(this.control instanceof validControlType))
			.reduce((previous, current) => previous && current);
	}

	private setFocus(): void {
		if (this.control instanceof HTMLInputElement && this.focusOnClear) {
			this.control.focus();
		}
	}

	private addParentClass(cssClassName: string): void {
		const parent = this.element.nativeElement.parentElement;
		if (parent) {
			parent.classList.add(cssClassName);
		}
	}

	private removeParentClass(cssClassName: string): void {
		const parent = this.element.nativeElement.parentElement;
		if (parent) {
			parent.classList.remove(cssClassName);
		}
	}

	private handleParentClass(value: string): void {
		if (value) {
			this.addParentClass('ob-text-control-clear-has-value');
		} else {
			this.removeParentClass('ob-text-control-clear-has-value');
		}
	}
}
