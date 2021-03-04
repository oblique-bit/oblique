import {Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
	selector: 'ob-dropdown',
	exportAs: 'obDropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-dropdown'}
})
export class ObDropdownComponent implements OnInit, OnDestroy {
	//Accessibility features
	@HostBinding('attr.aria-expanded') expandedOrUndefined = undefined;
	@HostBinding('attr.aria-haspopup') popup = true;
	@HostBinding('attr.aria-owns') @HostBinding('attr.aria-controls') idContent: string;

	//Dropdown features
	@HostBinding('class.ob-expanded') isOpen = false;
	@Input() position = 'middle';
	@Input() @HostBinding('id') id: string;

	private static idCount = 0;
	private readonly unsubscribe = new Subject();

	constructor(private readonly element: ElementRef, private readonly globalEventsService: ObGlobalEventsService) {}

	ngOnInit(): void {
		this.globalEventsService.click$.pipe(takeUntil(this.unsubscribe)).subscribe(event => this.toggle(event));
		if (!this.id) {
			ObDropdownComponent.idCount++;
			this.id = 'dropdown-' + ObDropdownComponent.idCount;
		}
		this.idContent = `${this.id}-content`;
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	toggle($event?: MouseEvent) {
		this.isOpen = !$event || this.isSelf($event.target as Element) ? !this.isOpen : false;
		this.expandedOrUndefined = this.isOpen ? true : undefined;
	}

	private isSelf(el: Element): boolean {
		return el ? (el === this.element.nativeElement ? true : this.isSelf(el.parentElement)) : false;
	}
}
