import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, OnInit, Output} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {FormControl, NgModel} from '@angular/forms';
import {WINDOW} from '../utilities';

@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-input-clear'}
})
export class ObInputClearDirective implements OnInit {
	@Input('obInputClear') control: HTMLInputElement | FormControl | NgModel;
	@Input() focusOnClear = true;
	@Input() datePickerRef: MatDatepicker<any>;
	@Output() onClear = new EventEmitter<MouseEvent>();
	@HostBinding('class.ob-text-control-clear') cssClass = true;
	private readonly window: Window;

	constructor(private readonly element: ElementRef, @Inject(WINDOW) window: any) {
		this.window = window; // because AoT don't accept interfaces as DI
		// ensure matInput got resolved beforehand
		this.window.setTimeout(() => {
			const parent = this.element.nativeElement.parentElement;
			if (parent) {
				parent.classList.add('ob-text-control');
			}
		});
	}

	ngOnInit() {
		if (!(this.control instanceof HTMLInputElement) && !(this.control instanceof FormControl) && !(this.control instanceof NgModel)) {
			console.warn(
				'ObInputClearDirective: illegal value for obInputClear Input, please use one of the following: HTMLInputElement, FormControl or NgModel.'
			);
		}
	}

	@HostListener('click', ['$event'])
	onClick($event: MouseEvent) {
		this.clearDatePicker();
		this.clearInputField();
		this.setFocus();
		this.onClear.next($event);
	}

	private clearDatePicker(): void {
		if (this.datePickerRef) {
			this.datePickerRef.select(undefined);
		}
	}

	private clearInputField(): void {
		this.clearReactiveForm();
		this.clearTemplateDrivenForm();
		this.clearHtmlInput();
	}

	private clearReactiveForm(): void {
		if (this.control instanceof FormControl) {
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

	private setFocus(): void {
		if (this.control instanceof HTMLInputElement && this.focusOnClear) {
			this.control.focus();
		}
	}
}
