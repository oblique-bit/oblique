import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
	selector: '[obNumberFormat]',
	exportAs: 'obNumberFormat'
})
export class ObNumberFormatDirective implements OnInit {
	@Input() decimals = 2;
	@Input() persistent = true;
	private changed = false;
	private focused = false;

	constructor(private readonly ngControl: NgControl, private readonly el: ElementRef) {
	}

	@HostListener('blur')
	onBlur(): void {
		this.focused = false;
		const value = ObNumberFormatDirective.toFixedNumber(this.ngControl.value, this.decimals);
		if (this.persistent) {
			this.changed = true;
			this.ngControl.reset(value);
		} else {
			this.el.nativeElement.value = value;
		}
	}

	@HostListener('focus')
	onFocus(): void {
		this.focused = true;
		if (!this.persistent) {
			this.ngControl.reset(this.ngControl.value);
		}
	}

	ngOnInit(): void {
		this.ngControl.valueChanges.subscribe((value: number): void => {
			if (this.changed || this.focused || isNaN(value)) {
				this.changed = false;
				return;
			}
			this.setValue(value);
		});
		this.setValue(this.ngControl.value);		// for Reactive forms
	}

	private static toFixedNumber(number: number, decimals: number): number {
		const pow = Math.pow(10, decimals);
		return +(Math.round(number * pow) / pow);
	}

	private setValue(value: number): void {
		const fixedValue = ObNumberFormatDirective.toFixedNumber(value, this.decimals);
		if (this.persistent) {
			this.changed = true;
			this.ngControl.reset(fixedValue);
		} else {
			this.el.nativeElement.value = fixedValue;
		}
	}
}
