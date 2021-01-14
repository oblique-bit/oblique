import {Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-dropdown',
	exportAs: 'obDropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-dropdown'}
})
export class ObDropdownComponent implements OnInit {
	//Accessibility features
	@HostBinding('attr.aria-expanded') expandedOrUndefined = undefined;
	@HostBinding('attr.aria-haspopup') popup = true;
	@HostBinding('attr.aria-owns') @HostBinding('attr.aria-controls') idContent: string;

	//Dropdown features
	@HostBinding('class.open') isOpen = false;
	@Input() position = 'middle';
	@Input() @HostBinding('id') id: string;

	private static idCount = 0;

	constructor(private readonly element: ElementRef) {}

	ngOnInit(): void {
		if (!this.id) {
			ObDropdownComponent.idCount++;
			this.id = 'dropdown-' + ObDropdownComponent.idCount;
		}
		this.idContent = `${this.id}-content`;
	}

	@HostListener('document:click', ['$event'])
	toggle($event?: MouseEvent) {
		this.isOpen = !$event || this.isSelf($event.target as Element) ? !this.isOpen : false;
		this.expandedOrUndefined = this.isOpen ? true : undefined;
	}

	private isSelf(el: Element): boolean {
		return el ? (el === this.element.nativeElement ? true : this.isSelf(el.parentElement)) : false;
	}
}
