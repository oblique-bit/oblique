import {Directive, ElementRef, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer2} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {first, takeUntil, tap} from 'rxjs/operators';
import {EXTERNAL_LINK, ObEExternalLinkIcon} from './external-link.model';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'a[href]',
	host: {class: 'ob-external-link'}
})
export class ObExternalLinkDirective implements OnInit, OnChanges, OnDestroy {
	@Input() @HostBinding('attr.rel') rel: string;
	@Input() @HostBinding('attr.target') target: string;
	@Input() @HostBinding('attr.href') href: string;
	@Input() icon: ObEExternalLinkIcon;

	private readonly unsubscribe = new Subject<void>();
	private iconElement: HTMLSpanElement;
	private readonly host: HTMLAnchorElement;
	private hasIcon = false;
	private readonly screenReaderOnlyTextElement: HTMLSpanElement = this.createScreenReaderOnlyTextElement();

	constructor(
		@Optional() @Inject(EXTERNAL_LINK) private readonly config,
		private readonly renderer: Renderer2,
		elRef: ElementRef,
		private readonly translate: TranslateService,
		private readonly iconRegistry: MatIconRegistry
	) {
		this.host = elRef.nativeElement;
		this.icon = this.icon || this.config?.icon || 'left';
	}

	ngOnInit(): void {
		this.addScreenReaderOnlyTextElement();
		this.translateScreenReaderOnlyText();
		this.iconRegistry
			.getNamedSvgIcon('external')
			.pipe(
				first(),
				tap(svg => (this.iconElement = this.createIconElement(svg)))
			)
			.subscribe(() => this.addIcon());
	}

	ngOnChanges(): void {
		this.removeIcon();
		this.rel = ObExternalLinkDirective.initializeAttribute(this.rel, this.config?.rel || 'noopener noreferrer');
		this.target = ObExternalLinkDirective.initializeAttribute(this.target, this.config?.target || '_blank');
		this.addIcon();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private static initializeAttribute(currentValue: string, defaultValue: string): string {
		return currentValue === '' ? undefined : currentValue ?? defaultValue;
	}

	private addScreenReaderOnlyTextElement(): void {
		this.renderer.appendChild(this.host, this.screenReaderOnlyTextElement);
	}

	private translateScreenReaderOnlyText(): void {
		this.translate
			.stream('i18n.oblique.external')
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((text: string) => this.renderer.setProperty(this.screenReaderOnlyTextElement, 'textContent', ` - ${text}`));
	}

	private addIcon(): void {
		if (this.icon !== 'none' && this.iconElement) {
			if (this.icon === 'left') {
				this.renderer.insertBefore(this.host, this.iconElement, this.host.firstChild);
			} else {
				this.renderer.appendChild(this.host, this.iconElement);
			}
			this.hasIcon = true;
		}
	}

	private removeIcon(): void {
		if (this.iconElement && this.hasIcon) {
			this.renderer.removeChild(this.host, this.iconElement);
			this.hasIcon = false;
		}
	}

	private createIconElement(svg?: SVGElement): HTMLSpanElement {
		const span = this.renderer.createElement('span');
		this.renderer.addClass(span, 'mat-icon');
		this.renderer.appendChild(span, svg);
		return span;
	}

	private createScreenReaderOnlyTextElement(): HTMLSpanElement {
		const screenReaderOnlyTextElement = this.renderer.createElement('span');
		this.renderer.addClass(screenReaderOnlyTextElement, 'ob-screen-reader-only');
		return screenReaderOnlyTextElement;
	}
}
