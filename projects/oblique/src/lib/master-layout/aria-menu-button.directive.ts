import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {ObGlobalEventsService} from "../global-events/global-events.service";
import {obOutsideFilter} from "../global-events/outsideFilter";

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
		this.globalEvents.click$.pipe(obOutsideFilter(this.element.nativeElement)).subscribe(() => (this.active = undefined));
	}

	@HostListener('click')
	@HostListener('keyup.enter')
	onClick(): void {
		this.active = this.active ? undefined : true;
	}
}
