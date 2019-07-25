import {Component, ElementRef, HostBinding, HostListener, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'or-dropdown',
	exportAs: 'orDropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'dropdown'}
})
export class DropdownComponent {
	@HostBinding('class.open') isOpen = false;
	@Input() position = 'middle';

	constructor(private readonly element: ElementRef) {
	}

	@HostListener('document:click', ['$event'])
	toggle($event?: MouseEvent) {
		this.isOpen = !$event || this.isSelf(<Element>$event.target)
			? !this.isOpen
			: false;
	}

	private isSelf(el: Element): boolean {
		return el
			? (el === this.element.nativeElement
				? true
				: this.isSelf(el.parentElement))
			: false;
	}
}
