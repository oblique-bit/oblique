import {Directive, ElementRef, Input, OnChanges, OnInit} from '@angular/core';
import {ObIconButtonDirective} from './icon-button.directive';

@Directive({
	selector: '[obButton]',
	standalone: true,
	host: {
		'[class.ob-button-primary]': 'primaryClass',
		'[class.ob-button-secondary]': 'secondaryClass',
		'[class.ob-button-tertiary]': 'tertiaryClass',
		class: 'ob-button mat-primary',
	},
	hostDirectives: [ObIconButtonDirective],
	exportAs: 'obButton',
})
export class ObButtonDirective implements OnInit, OnChanges {
	@Input() obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
	primaryClass: boolean;
	secondaryClass: boolean;
	tertiaryClass: boolean;
	private static readonly forbidden = [
		'mat-raised-button',
		'mat-fab',
		'mat-mini-fab',
		'mat-stroked-button',
		'mat-flat-button',
	];

	constructor(private readonly element: ElementRef) {}

	ngOnInit(): void {
		this.validateButtonVariant();
		this.setButtonClass();
	}

	ngOnChanges(): void {
		this.setButtonClass();
	}

	private setButtonClass(): void {
		this.obButton ||= 'primary';
		this.primaryClass = this.obButton === 'primary';
		this.secondaryClass = this.obButton === 'secondary';
		this.tertiaryClass = this.obButton === 'tertiary';
	}

	private validateButtonVariant(): void {
		const attribute = ObButtonDirective.forbidden.find(variant => this.element.nativeElement.hasAttribute(variant));
		if (attribute) {
			console.error(
				`The obButton directive is meant to be used with mat-button or mat-icon-button exclusively. An instance of ${attribute}, which can lead to unexpected effects, has been detected, please change it to one of the supported variant.`
			);
		}
	}
}
