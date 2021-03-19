import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, Output} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {WINDOW} from '../utilities';

@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-input-clear'}
})
export class ObInputClearDirective {
	@Input('obInputClear') control: HTMLInputElement;
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

	@HostListener('click', ['$event'])
	onClick($event: MouseEvent) {
		if (this.datePickerRef) {
			this.datePickerRef.select(undefined);
		}
		this.control.value = '';
		if (this.focusOnClear) {
			this.control.focus();
		}
		this.onClear.next($event);
	}
}
