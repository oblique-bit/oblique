import {Directive, HostBinding, Input, OnChanges, OnInit, Optional} from '@angular/core';
import {MatAnchor, MatButton} from '@angular/material/button';

@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
	host: {class: 'ob-button'}
})
export class ObButtonDirective implements OnInit, OnChanges {
	@Input() obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
	@HostBinding('class.mat-flat-button') primaryClass: boolean;
	@HostBinding('class.mat-stroked-button') secondaryClass: boolean;

	constructor(@Optional() btn: MatButton, @Optional() link: MatAnchor) {
		(btn || link).color = 'primary';
	}

	ngOnInit() {
		this.setButtonClass();
	}

	ngOnChanges() {
		this.setButtonClass();
	}

	private setButtonClass() {
		this.obButton = this.obButton || 'primary';
		this.primaryClass = this.obButton === 'primary';
		this.secondaryClass = this.obButton === 'secondary';
	}
}
