import {
	Directive,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Renderer2,
	TemplateRef,
	ViewContainerRef
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {createPopper, Instance, Options, Placement} from '@popperjs/core';
import {race} from 'rxjs';
import {filter, first} from 'rxjs/operators';
import {defaultConfig} from './popover.model';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';

@Directive({
	selector: '[obPopover]',
	exportAs: 'obPopover',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-popover'}
})
export class ObPopoverDirective implements OnInit, OnChanges, OnDestroy {
	@Input('obPopover') target: TemplateRef<HTMLElement>;
	@Input() placement: Placement = 'auto';
	@Input() popperOptions: Options = {} as Options;
	@Input() id: string;
	@HostBinding('attr.aria-describedby') idContent: string;

	private static idCount = 0;
	private readonly body: HTMLBodyElement;
	private readonly host: HTMLElement;
	private instance: Instance;
	private popover: HTMLDivElement;

	constructor(
		el: ElementRef,
		private readonly renderer: Renderer2,
		@Inject(DOCUMENT) document: any,
		private readonly globalEventsService: ObGlobalEventsService,
		private readonly viewContainerRef: ViewContainerRef
	) {
		this.body = document.body;
		this.host = el.nativeElement;
	}

	ngOnInit(): void {
		this.id = this.id || `popover-${ObPopoverDirective.idCount++}`;
		this.idContent = `${this.id}-content`;
	}

	ngOnChanges(): void {
		this.setPopperOptionsAndUpdate();
	}

	ngOnDestroy(): void {
		this.popover?.remove();
		this.popover = undefined;
		this.instance?.destroy();
		this.instance = undefined;
	}

	@HostListener('click') toggle(): void {
		if (!this.popover) {
			this.open();
		} else {
			this.close();
		}
	}

	close(): void {
		this.ngOnDestroy();
	}

	open(): void {
		this.buildPopover();
		this.outsideClick();
		// without the setTimeout, the options aren't applied
		setTimeout(() => {
			this.renderer.appendChild(this.body, this.popover);
			this.instance = createPopper(this.host, this.popover, defaultConfig);
			this.setPopperOptionsAndUpdate();
		});
	}

	private setPopperOptionsAndUpdate(): void {
		this.instance?.setOptions({...this.popperOptions, placement: this.placement});
		this.instance?.update();
	}

	private buildPopover(): void {
		this.popover = this.renderer.createElement('div');
		this.viewContainerRef.createEmbeddedView<HTMLElement>(this.target).rootNodes.forEach(node => this.renderer.appendChild(this.popover, node));
		this.renderer.addClass(this.popover, 'ob-popover-content');
		this.renderer.setAttribute(this.popover, 'role', 'tooltip');
		this.renderer.setAttribute(this.popover, 'id', this.idContent);
		const arrow = this.renderer.createElement('div');
		this.renderer.addClass(arrow, 'ob-popover-arrow');
		this.renderer.appendChild(this.popover, arrow);
	}

	private outsideClick(): void {
		race(
			this.globalEventsService.click$.pipe(obOutsideFilter(this.host, this.popover)),
			this.globalEventsService.keyDown$.pipe(filter(evt => evt.key === 'Escape'))
		)
			.pipe(first())
			.subscribe(() => this.close());
	}
}
