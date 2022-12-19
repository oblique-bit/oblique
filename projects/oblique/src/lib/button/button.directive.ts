import {Directive, ElementRef, HostBinding, Input, OnChanges, OnInit, Optional} from '@angular/core';
import {MatLegacyAnchor as MatAnchor, MatLegacyButton as MatButton} from '@angular/material/legacy-button';

@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
	host: {class: 'ob-button'}
})
export class ObButtonDirective implements OnInit, OnChanges {
	@Input() obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
	@HostBinding('class.mat-flat-button') primaryClass: boolean;
	@HostBinding('class.mat-stroked-button') secondaryClass: boolean;
	private static readonly forbidden = ['mat-raised-button', 'mat-fab', 'mat-mini-fab', 'mat-stroked-button', 'mat-flat-button'];

	constructor(@Optional() btn: MatButton, @Optional() link: MatAnchor, private readonly element: ElementRef) {
		(btn || link).color = 'primary';
	}

	ngOnInit(): void {
		this.validateButtonVariant();
		this.setButtonClass();
	}

	ngOnChanges(): void {
		this.setButtonClass();
	}

	private setButtonClass(): void {
		/* eslint-disable logical-assignment-operators */
		this.obButton = this.obButton || 'primary';
		this.primaryClass = this.obButton === 'primary';
		this.secondaryClass = this.obButton === 'secondary';
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
