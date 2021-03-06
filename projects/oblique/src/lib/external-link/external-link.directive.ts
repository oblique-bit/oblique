import {Directive, ElementRef, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer2} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {first, takeUntil, tap} from 'rxjs/operators';
import {WINDOW} from '../utilities';
import {EXTERNAL_LINK, ObEExternalLinkIcon} from './external-link.model';
import {ObUseObliqueIcons} from '../icon/icon.model';

@Directive({
	selector: 'a[href]'
})
export class ObExternalLinkDirective implements OnInit, OnChanges, OnDestroy {
	@HostBinding('class.ob-external-link') isExternal = false;
	@Input() @HostBinding('attr.rel') rel: string;
	@Input() @HostBinding('attr.target') target: string;
	@Input() @HostBinding('attr.href') href: string;
	@Input() icon: ObEExternalLinkIcon;

	private readonly unsubscribe = new Subject<void>();
	private iconElement: HTMLSpanElement;
	private host: HTMLAnchorElement;
	private hasIcon = false;

	constructor(
		@Inject(WINDOW) private readonly window,
		@Optional() @Inject(EXTERNAL_LINK) private readonly config,
		@Optional() @Inject(ObUseObliqueIcons) private readonly useObliqueIcons: boolean,
		private readonly renderer: Renderer2,
		elRef: ElementRef,
		private readonly translate: TranslateService,
		private readonly iconRegistry: MatIconRegistry
	) {
		this.host = elRef.nativeElement;
		this.icon = this.icon || this.config?.icon || 'left';
		translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.addAriaLabel());
	}

	ngOnInit(): void {
		if (this.useObliqueIcons) {
			this.iconRegistry
				.getNamedSvgIcon('external')
				.pipe(
					first(),
					tap(svg => (this.iconElement = this.createIconElement(svg)))
				)
				.subscribe(() => this.addIcon());
		} else {
			this.iconElement = this.createIconElement();
			this.addIcon();
		}
	}

	ngOnChanges(): void {
		this.isExternal = this.isLinkExternal();
		this.removeIcon();
		this.addAriaLabel();
		if (this.isExternal) {
			this.rel = ObExternalLinkDirective.initializeAttribute(this.rel, this.config?.rel || 'noopener noreferrer');
			this.target = ObExternalLinkDirective.initializeAttribute(this.target, this.config?.target || '_blank');
			this.addIcon();
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private static initializeAttribute(currentValue: string, defaultValue: string): string {
		return currentValue === '' ? undefined : currentValue ?? defaultValue;
	}

	private addAriaLabel(): void {
		const label = this.isExternal ? `${this.host.text} - ${this.translate.instant('i18n.oblique.external')}` : undefined;
		this.renderer.setAttribute(this.host, 'aria-label', label);
	}

	private isLinkExternal(): boolean {
		return this.href.indexOf(this.window.location.hostname) !== 0;
	}

	private addIcon(): void {
		if (this.icon !== 'none' && this.iconElement) {
			const marginPosition = this.icon === 'left' ? 'right' : 'left';
			this.renderer.setProperty(this.iconElement, 'style', `margin-${marginPosition}: 4px`); //$spacing-xs

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
		if (this.useObliqueIcons) {
			this.renderer.addClass(span, 'ob-icon');
			this.renderer.addClass(span, 'mat-icon');
			this.renderer.appendChild(span, svg);
		} else {
			this.renderer.addClass(span, 'fa');
			this.renderer.addClass(span, 'fa-external-link-alt');
		}
		return span;
	}
}
