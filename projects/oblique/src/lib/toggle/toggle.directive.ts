import {Directive, HostBinding, HostListener, Input, OnInit} from '@angular/core';

@Directive({
	selector: '[orToggle]',
	exportAs: 'orToggle'
})
export class ToggleDirective implements OnInit {
	@HostBinding('class.show') @Input() active = false;
	@HostBinding('class') @Input('class') hostClass: string;
	@Input('orToggle') direction: string;

	@HostListener('click') toggle() {
		this.active = !this.active;
	}

	ngOnInit() {
		// use a Set to ensure there are no duplicates
		const classes = new Set();
		if (this.hostClass) {
			classes.add(this.hostClass.split(' '));
		}
		classes.add('toggle').add(`toggle-${this.direction || 'down-up'}`);
		if (this.active) {
			classes.add('show');
		}
		this.hostClass = Array.from(classes).join(' ');
	}
}
