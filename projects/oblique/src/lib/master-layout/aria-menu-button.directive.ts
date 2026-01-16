import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';
import {obMasterLayoutNavigationSubMenuFilter} from './master-layout-navigation/masterLayoutNavigationSubMenuFilter';
import {isNotKeyboardEventOnButton} from '../utilities';

@Directive({
	selector: '[obAriaMenuButton]',
	standalone: false,
	host: {
		'(click)': 'onClick($event)',
		'(keyup.enter)': 'onClick($event)',
		'(keyup.escape)': 'onEscape()',
		'[attr.aria-controls]': 'target',
		'[attr.aria-expanded]': 'active',
	},
	exportAs: 'obAriaMenuButton',
})
export class ObAriaMenuButtonDirective implements OnInit {
	@Input('obAriaMenuButton') target: string;
	active = false;

	constructor(
		private readonly globalEvents: ObGlobalEventsService,
		private readonly element: ElementRef
	) {}

	ngOnInit(): void {
		this.monitorForClickOutside();
	}

	onClick(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			this.active = !this.active;
		}
	}

	onEscape(): void {
		this.active = undefined;
	}

	private monitorForClickOutside(): void {
		this.globalEvents.click$
			.pipe(obOutsideFilter(this.element.nativeElement), obMasterLayoutNavigationSubMenuFilter())
			.subscribe(() => {
				this.active = false;
			});
	}
}
