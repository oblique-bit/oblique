import {Directive, ElementRef, HostBinding, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer2} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {Subject, switchMap} from 'rxjs';
import {first, startWith, takeUntil, tap} from 'rxjs/operators';
import {EXTERNAL_LINK, ObEExternalLinkIcon} from './external-link.model';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'a'
})
export class ObExternalLinkDirective implements OnInit, OnChanges, OnDestroy {
	@Input() @HostBinding('attr.rel') rel: string;
	@Input() @HostBinding('attr.target') target: string;
	@Input() isExternalLink: boolean | 'auto' = 'auto';
	@HostBinding('class.ob-external-link') isLinkExternal = false;
	@Input() icon: ObEExternalLinkIcon;

	private readonly unsubscribe = new Subject<void>();
	private iconElement: HTMLSpanElement;
	private readonly host: HTMLAnchorElement;
	private hasIcon = false;
	private readonly screenReaderOnlyTextElement: HTMLSpanElement = this.createScreenReaderOnlyTextElement();
	private readonly isLinkExternal$ = new Subject<boolean>();
	private defaultRel: string;
	private defaultTarget: string;

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
		this.defaultRel = this.rel;
		this.defaultTarget = this.target;
		this.translateScreenReaderOnlyText();
		this.iconRegistry
			.getNamedSvgIcon('external')
			.pipe(
				first(),
				tap(svg => (this.iconElement = this.createIconElement(svg))),
				switchMap(() => this.isLinkExternal$.pipe(startWith(this.isUrlExternal(this.host.href)))),
				tap(isLinkExternal => (this.isLinkExternal = isLinkExternal))
			)
			.subscribe(isLinkExternal => this.manageLink(isLinkExternal));
	}

	ngOnChanges(): void {
		this.isLinkExternal$.next(this.isUrlExternal(this.host.href));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private isUrlExternal(url: string | undefined): boolean {
		if (this.isExternalLink === 'auto') {
			return url ? !url.includes(window.location.host) : false;
		}
		return this.isExternalLink;
	}

	private manageLink(isLinkExternal: boolean): void {
		this.removeIcon();
		if (isLinkExternal) {
			this.rel = ObExternalLinkDirective.initializeAttribute(this.rel, this.config?.rel || 'noopener noreferrer');
			this.target = ObExternalLinkDirective.initializeAttribute(this.target, this.config?.target || '_blank');
			this.addScreenReaderOnlyTextElement();
			this.addIcon();
		} else {
			this.rel = this.defaultRel;
			this.target = this.defaultTarget;
			this.removeScreenReaderOnlyTextElement();
		}
	}

	private static initializeAttribute(currentValue: string, defaultValue: string): string {
		return currentValue === '' ? undefined : currentValue ?? defaultValue;
	}

	private addScreenReaderOnlyTextElement(): void {
		this.renderer.appendChild(this.host, this.screenReaderOnlyTextElement);
	}
	private removeScreenReaderOnlyTextElement(): void {
		this.renderer.removeChild(this.host, this.screenReaderOnlyTextElement);
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
