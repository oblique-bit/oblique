import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear'
})
export class ObInputClearDirective {
	@Input('obInputClear') control: HTMLInputElement;
	@Input() focusOnClear = true;
	@Output() onClear = new EventEmitter<MouseEvent>();
	@HostBinding('class.text-control-clear') cssClass = true;

	constructor(private readonly element: ElementRef) {
		// ensure matInput got resolved beforehand
		setTimeout(() => {
			const parent = this.element.nativeElement.parentElement;
			if (parent) {
				parent.classList.add('text-control');
			}
		});
	}

	@HostListener('click', ['$event'])
	onClick($event: MouseEvent) {
		this.control.value = '';
		if (this.focusOnClear) {
			this.control.focus();
		}
		this.onClear.next($event);
	}
}
