import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-button'}
})
export class ObButtonDirective implements OnInit {
	@Input() obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';

	private static readonly classes = {
		primary: 'mat-flat-button',
		secondary: 'mat-stroked-button'
	};

	constructor(private readonly el: ElementRef, private readonly renderer: Renderer2, btn: MatButton) {
		btn.color = 'primary';
	}

	ngOnInit() {
		this.obButton = this.obButton || 'primary';
		const buttonClass = ObButtonDirective.classes[this.obButton];
		if (buttonClass) {
			this.renderer.addClass(this.el.nativeElement, buttonClass);
		}
	}
}
