import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-button'}
})
export class ObButtonDirective implements OnInit {
	@Input() obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
	@HostBinding('class.mat-flat-button') primaryClass: boolean;
	@HostBinding('class.mat-stroked-button') secondaryClass: boolean;

	constructor(btn: MatButton) {
		btn.color = 'primary';
	}

	ngOnInit() {
		this.obButton = this.obButton || 'primary';
		this.primaryClass = this.obButton === 'primary';
		this.secondaryClass = this.obButton === 'secondary';
	}
}
