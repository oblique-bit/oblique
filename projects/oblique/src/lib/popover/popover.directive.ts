import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
	InjectionToken,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Optional,
	Renderer2,
	TemplateRef,
	ViewContainerRef
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Instance, Options, Placement, createPopper} from '@popperjs/core';
import {race} from 'rxjs';
import {filter, first} from 'rxjs/operators';
import {ObEToggleType, defaultConfig} from './popover.model';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';
import {isNotKeyboardEventOnButton} from '../utilities';

export const OBLIQUE_POPOVER_TOGGLE_HANDLE = new InjectionToken<ObEToggleType>('Define the toggle handle for all Oblique popover');
export const OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE = new InjectionToken<boolean>(
	'All Oblique popover are only closed when clicking on the toggle element'
);

@Directive({
	selector: '[obPopover]',
	exportAs: 'obPopover',
	host: {class: 'ob-popover'}
})
export class ObPopoverDirective implements OnInit, OnChanges, OnDestroy {
	@Input('obPopover') target: TemplateRef<HTMLElement>;
	@Input() placement: Placement = 'auto';
	@Input() popperOptions: Options = {} as Options;
	@Input() id: string;
	@Input() toggleHandle: ObEToggleType;
	@Input() closeOnlyOnToggle: boolean;
	@HostBinding('attr.aria-describedby') idContent: string;

	private static idCount = 0;
	private readonly body: HTMLElement;
	private readonly host: HTMLElement;
	private instance: Instance;
	private popover: HTMLDivElement;
	private isMouseHoverConfigured: boolean;
	private isCloseOnlyOnToggleConfigured: boolean;

	constructor(
		el: ElementRef,
		private readonly renderer: Renderer2,
		@Inject(DOCUMENT) document: Document,
		@Optional() @Inject(OBLIQUE_POPOVER_TOGGLE_HANDLE) private readonly globalToggleHandle: ObEToggleType,
		@Optional() @Inject(OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE) private readonly globalCloseOnlyOnToggle: boolean,
		private readonly globalEventsService: ObGlobalEventsService,
		private readonly viewContainerRef: ViewContainerRef
	) {
		this.body = document.body;
		this.host = el.nativeElement;
	}

	ngOnInit(): void {
		this.id = this.id || `popover-${ObPopoverDirective.idCount++}`;
		this.idContent = `${this.id}-content`;
		this.updateToggleMethod();
		this.updateCloseOnlyOnToggle();
	}

	ngOnChanges(): void {
		this.setPopperOptionsAndUpdate();
		this.updateToggleMethod();
		this.updateCloseOnlyOnToggle();
	}

	ngOnDestroy(): void {
		this.close();
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	toggle(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			if (event instanceof MouseEvent && this.isMouseHoverConfigured) {
				return;
			}

			if (this.popover) {
				this.close();
			} else {
				this.open();
			}
		}
	}

	@HostListener('mouseleave') handleMouseLeave(): void {
		if (this.isMouseHoverConfigured) {
			this.close();
		}
	}

	@HostListener('mouseenter') handleMouseEnter(): void {
		if (this.isMouseHoverConfigured) {
			this.open();
		}
	}

	close(): void {
		this.popover?.remove();
		this.popover = undefined;
		this.instance?.destroy();
		this.instance = undefined;
	}

	open(): void {
		this.popover = this.buildPopover();

		if (!this.isCloseOnlyOnToggleConfigured) {
			this.listenForCloseEvent();
		}

		// without the setTimeout, the options aren't applied
		setTimeout(() => {
			this.renderer.appendChild(this.body, this.popover);
			this.instance = createPopper(this.host, this.popover, defaultConfig);
			this.setPopperOptionsAndUpdate();
		});
	}

	private updateToggleMethod(): void {
		this.isMouseHoverConfigured = this.getToggleMethod() === ObEToggleType.HOVER;
	}

	private getToggleMethod(): ObEToggleType {
		return this.toggleHandle ?? this.globalToggleHandle ?? ObEToggleType.CLICK;
	}

	private updateCloseOnlyOnToggle(): void {
		this.isCloseOnlyOnToggleConfigured = this.closeOnlyOnToggle ?? this.globalCloseOnlyOnToggle ?? false;
	}

	private setPopperOptionsAndUpdate(): void {
		this.instance?.setOptions({...this.popperOptions, placement: this.placement});
		this.instance?.update();
	}

	private buildPopover(): HTMLDivElement {
		const popover = this.renderer.createElement('div');
		this.viewContainerRef.createEmbeddedView<HTMLElement>(this.target).rootNodes.forEach(node => this.renderer.appendChild(popover, node));
		this.renderer.addClass(popover, 'ob-popover-content');
		this.renderer.setAttribute(popover, 'role', 'tooltip');
		this.renderer.setAttribute(popover, 'id', this.idContent);

		const arrow = this.renderer.createElement('div');
		this.renderer.addClass(arrow, 'ob-popover-arrow');
		this.renderer.appendChild(popover, arrow);

		return popover;
	}

	private listenForCloseEvent(): void {
		race(
			this.globalEventsService.click$.pipe(obOutsideFilter(this.host, this.popover)),
			this.globalEventsService.keyDown$.pipe(filter(evt => evt.key === 'Escape'))
		)
			.pipe(first())
			.subscribe(() => this.close());
	}
}
