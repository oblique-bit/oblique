import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';
import {obMasterLayoutNavigationSubMenuFilter} from './master-layout-navigation/masterLayoutNavigationSubMenuFilter';
import {isNotKeyboardEventOnButton} from '../utilities';

@Directive({
	selector: '[obAriaMenuButton]',
	exportAs: 'obAriaMenuButton'
})
export class ObAriaMenuButtonDirective implements OnInit {
	@Input('obAriaMenuButton') @HostBinding('attr.aria-owns') @HostBinding('attr.aria-controls') target: string;
	@HostBinding('attr.aria-expanded') active = undefined;
	@HostBinding('attr.aria-haspopup') popup = true;

	constructor(private readonly globalEvents: ObGlobalEventsService, private readonly element: ElementRef) {}

	ngOnInit(): void {
		this.monitorForClickOutside();
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	onClick(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			this.active = this.active ? undefined : true;
		}
	}

	@HostListener('keyup.escape')
	onEscape(): void {
		this.active = undefined;
	}

	private monitorForClickOutside(): void {
		this.globalEvents.click$
			.pipe(obOutsideFilter(this.element.nativeElement), obMasterLayoutNavigationSubMenuFilter())
			.subscribe(() => (this.active = undefined));
	}
}
