import {DestroyRef, Directive, ElementRef, OnInit, inject, input, output} from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {AbstractControl, NgModel} from '@angular/forms';
import {WINDOW} from '../window/window.provider';
import {ObWindow} from '../window/window.provider.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {fromEvent, startWith} from 'rxjs';
import {ObConsoleService} from '../console/ob-console.service';

@Directive({
	selector: '[obInputClear]',
	host: {
		'(click)': 'onClick($event)',
		'[class.ob-text-control-clear]': 'cssClass',
		class: 'ob-input-clear',
	},
	exportAs: 'obInputClear',
})
export class ObInputClearDirective implements OnInit {
	readonly control = input<AbstractControl | HTMLInputElement | NgModel>(undefined, {alias: 'obInputClear'});
	readonly focusOnClear = input(true);
	readonly datePickerRef = input<MatDatepicker<unknown>>(undefined);
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	readonly onClear = output<MouseEvent>();
	cssClass = true;

	private readonly element = inject(ElementRef);
	private readonly validControlTypes = [AbstractControl, HTMLInputElement, NgModel];
	private readonly window = inject<ObWindow>(WINDOW);
	private readonly destroyRef = inject(DestroyRef);
	private readonly obConsole = inject(ObConsoleService);

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

	onClick($event: MouseEvent): void {
		this.clearDatePicker();
		this.clearInputField();
		this.setFocus();
		this.onClear.emit($event);
	}

	private checkControlType(): void {
		if (this.isInvalidControlType()) {
			const inputTypes = this.validControlTypes
				.map(validControlType => validControlType.name)
				.reduce((previous, current) => `${previous}, ${current}`);
			this.obConsole.warn(
				'ObInputClearDirective checkControlType()',
				`${ObInputClearDirective.name}: illegal value for obInputClear Input, please use one of the following: [${inputTypes}].`
			);
		}
	}

	private clearDatePicker(): void {
		const datePickerRef = this.datePickerRef();
		if (datePickerRef) {
			datePickerRef.select(undefined);
		}
	}

	private subscribeToInputValueChange(): void {
		const control = this.control();
		if (control instanceof AbstractControl) {
			control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef), startWith(control.value)).subscribe(value => {
				this.handleParentClass(value);
			});
		}

		if (control instanceof NgModel) {
			control.control.valueChanges
				.pipe(takeUntilDestroyed(this.destroyRef), startWith(control.value))
				.subscribe(value => {
					this.handleParentClass(value);
				});
		}

		if (control instanceof HTMLInputElement) {
			fromEvent(control, 'keyup')
				.pipe(takeUntilDestroyed(this.destroyRef), startWith(control.value))
				.subscribe(() => this.handleParentClass(this.control().value));
		}
	}

	private clearInputField(): void {
		this.clearReactiveForm();
		this.clearTemplateDrivenForm();
		this.clearHtmlInput();
	}

	private clearReactiveForm(): void {
		const control = this.control();
		if (control instanceof AbstractControl) {
			control.patchValue(null);
		}
	}

	private clearTemplateDrivenForm(): void {
		const control = this.control();
		if (control instanceof NgModel) {
			control.control.patchValue(null);
		}
	}

	private clearHtmlInput(): void {
		const control = this.control();
		if (control instanceof HTMLInputElement) {
			control.value = '';
		}
	}

	private isInvalidControlType(): boolean {
		return this.validControlTypes
			.map(validControlType => !(this.control() instanceof validControlType))
			.reduce((previous, current) => previous && current);
	}

	private setFocus(): void {
		const control = this.control();
		if (control instanceof HTMLInputElement && this.focusOnClear()) {
			control.focus();
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
