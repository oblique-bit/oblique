import {Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnChanges, OnDestroy, OnInit, Renderer2, TemplateRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {createPopper, Instance, Options, Placement} from '@popperjs/core';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {defaultConfig} from './popover.model';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';

@Directive({
	selector: '[obPopover]',
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
	private readonly unsubscribe = new Subject();
	private readonly body: HTMLBodyElement;
	private readonly host: HTMLElement;
	private instance: Instance;
	private isDisplayed = false;
	private popover: HTMLDivElement;

	constructor(
		el: ElementRef,
		private readonly renderer: Renderer2,
		@Inject(DOCUMENT) document: any,
		private readonly globalEventsService: ObGlobalEventsService
	) {
		this.body = document.body;
		this.host = el.nativeElement;
	}

	ngOnInit(): void {
		this.id = this.id || `popover-${ObPopoverDirective.idCount++}`;
		this.idContent = `${this.id}-content`;
		this.buildPopover();
		this.outsideClick();
	}

	ngOnChanges(): void {
		this.setPopperOptionsAndUpdate();
	}

	ngOnDestroy(): void {
		this.popover.remove();
		this.instance?.destroy();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	@HostListener('click') toggle(): void {
		if (!this.isDisplayed) {
			this.open();
		} else {
			this.close();
		}
	}

	@HostListener('window:keydown.escape') close(): void {
		this.popover.remove();
		this.instance?.destroy();
		this.isDisplayed = false;
	}

	open(): void {
		this.renderer.appendChild(this.body, this.popover);
		this.instance = createPopper(this.host, this.popover, defaultConfig);
		this.setPopperOptionsAndUpdate();
		this.isDisplayed = true;
	}

	private setPopperOptionsAndUpdate(): void {
		this.instance?.setOptions({...this.popperOptions, placement: this.placement});
		this.instance?.update();
	}

	private buildPopover(): void {
		this.popover = this.renderer.createElement('div');
		this.target.createEmbeddedView(this.body).rootNodes.forEach(node => this.renderer.appendChild(this.popover, node));
		this.renderer.addClass(this.popover, 'ob-popover-content');
		this.renderer.setAttribute(this.popover, 'role', 'tooltip');
		this.renderer.setAttribute(this.popover, 'id', this.idContent);
		const arrow = this.renderer.createElement('div');
		this.renderer.addClass(arrow, 'ob-popover-arrow');
		this.renderer.appendChild(this.popover, arrow);
	}

	private outsideClick(): void {
		this.globalEventsService.click$
			.pipe(
				obOutsideFilter(this.host, this.popover),
				filter(() => this.isDisplayed),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.close());
	}
}
