import {Component, ElementRef, HostBinding, HostListener, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-dropdown',
	exportAs: 'obDropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'dropdown'}
})
export class ObDropdownComponent {
	@HostBinding('class.open') isOpen = false;
	@Input() position = 'middle';

	constructor(private readonly element: ElementRef) {}

	@HostListener('document:click', ['$event'])
	toggle($event?: MouseEvent) {
		this.isOpen = !$event || this.isSelf($event.target as Element) ? !this.isOpen : false;
	}

	private isSelf(el: Element): boolean {
		return el ? (el === this.element.nativeElement ? true : this.isSelf(el.parentElement)) : false;
	}
}
