import {
	DOCUMENT,
	Directive,
	ElementRef,
	EventEmitter,
	InjectionToken,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	TemplateRef,
	ViewContainerRef,
	inject,
} from '@angular/core';
import {Instance, Options, Placement, createPopper} from '@popperjs/core';
import {race} from 'rxjs';
import {filter, first} from 'rxjs/operators';
import {ObEToggleType, defaultConfig} from './popover.model';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';
import {WINDOW, isNotKeyboardEventOnButton} from '../utilities';
import {ObWindow} from '../utilities.model';

export const OBLIQUE_POPOVER_TOGGLE_HANDLE = new InjectionToken<ObEToggleType>(
	'Define the toggle handle for all Oblique popover'
);
export const OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE = new InjectionToken<boolean>(
	'All Oblique popover are only closed when clicking on the toggle element'
);
export const OBLIQUE_POPOVER_APPEND_TO_BODY = new InjectionToken<boolean>(
	'Appends all popover to the body per default'
);

@Directive({
	selector: '[obPopover]',
	host: {
		'(click)': 'toggle($event)',
		'(keyup.enter)': 'toggle($event)',
		'(mouseenter)': 'handleMouseEnter()',
		'(mouseleave)': 'handleMouseLeave()',
		'[attr.aria-controls]': 'idContent',
		'[attr.aria-describedby]': 'idContent',
		'[attr.aria-expanded]': 'isExpanded',
		'aria-haspopup': 'menu',
		class: 'ob-popover',
	},
	exportAs: 'obPopover',
})
export class ObPopoverDirective implements OnInit, OnChanges, OnDestroy {
	@Input('obPopover') target: TemplateRef<HTMLElement>;
	@Input() placement: Placement = 'auto';
	@Input() popperOptions: Options = {} as Options;
	@Input() id: string;
	@Input() panelContentId: string;
	@Input() toggleHandle: ObEToggleType;
	@Input() closeOnlyOnToggle: boolean;
	@Input() appendToBody = false;
	@Output() readonly visibilityChange = new EventEmitter<boolean>();
	idContent: string;
	isExpanded = false;

	private static idCount = 0;
	private readonly body: HTMLElement;
	private readonly host: HTMLElement;
	private instance: Instance;
	private popover: HTMLDivElement;
	private isMouseHoverConfigured: boolean;
	private isCloseOnlyOnToggleConfigured: boolean;
	private readonly globalEventsService = inject(ObGlobalEventsService);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly renderer = inject(Renderer2);
	private readonly globalToggleHandle = inject<ObEToggleType>(OBLIQUE_POPOVER_TOGGLE_HANDLE, {optional: true});
	private readonly globalCloseOnlyOnToggle = inject(OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE, {optional: true});
	private readonly globalAppendToBody = inject(OBLIQUE_POPOVER_APPEND_TO_BODY, {optional: true});
	private readonly window = inject<ObWindow>(WINDOW);

	constructor() {
		const el = inject(ElementRef);
		const document = inject<Document>(DOCUMENT);
		this.body = document.body;
		this.host = el.nativeElement;
	}

	ngOnInit(): void {
		this.id ||= `popover-${ObPopoverDirective.idCount++}`;
		this.idContent = this.panelContentId || `${this.id}-content`;
		this.appendToBody = this.globalAppendToBody ?? this.appendToBody;
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

	handleMouseLeave(): void {
		if (this.isMouseHoverConfigured) {
			this.close();
		}
	}

	handleMouseEnter(): void {
		if (this.isMouseHoverConfigured) {
			this.open();
		}
	}

	close(): void {
		this.popover?.remove();
		this.popover = undefined;
		this.instance?.destroy();
		this.instance = undefined;
		this.isExpanded = false;
		this.visibilityChange.emit(false);
	}

	open(): void {
		this.popover = this.buildPopover();

		if (!this.isCloseOnlyOnToggleConfigured) {
			this.listenForCloseEvent();
		}

		const parent = this.appendToBody ? this.body : this.host.parentNode;
		const referenceNode = this.appendToBody ? null : this.host.nextSibling;
		this.renderer.insertBefore(parent, this.popover, referenceNode);
		this.instance = createPopper(this.host, this.popover, defaultConfig);
		// without the setTimeout, the options aren't applied
		this.window.setTimeout(() => {
			this.setPopperOptionsAndUpdate();
		});
		this.isExpanded = true;
		this.visibilityChange.emit(true);
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
		void this.instance?.setOptions({...this.popperOptions, placement: this.placement});
		void this.instance?.update();
		if (this.popover) {
			this.renderer.removeClass(this.popover, 'ob-popover-is-hidden');
		}
	}

	private buildPopover(): HTMLDivElement {
		const popover = this.renderer.createElement('div');
		const contentWrapper = this.renderer.createElement('div');
		this.renderer.addClass(contentWrapper, 'ob-popover-content-wrapper');
		this.viewContainerRef.createEmbeddedView<HTMLElement>(this.target).rootNodes.forEach(node => {
			this.renderer.appendChild(contentWrapper, node);
		});
		this.renderer.appendChild(popover, contentWrapper);
		this.renderer.addClass(popover, 'ob-popover-content');
		this.renderer.addClass(popover, 'ob-popover-is-hidden');
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
