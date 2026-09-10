import {Directive, ElementRef, OnChanges, Renderer2, inject, input} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {first} from 'rxjs/operators';

import {OptionLabelIconPosition} from '../autocomplete.model';
import {ObEIcon} from '../../icon/icon.model';

@Directive({
	selector: '[obOptionLabelIcon]',
	host: {class: 'ob-option-label-icon'},
})
export class ObOptionLabelIconDirective implements OnChanges {
	readonly iconName = input<ObEIcon>();
	readonly iconPosition = input<OptionLabelIconPosition>('end');
	readonly ariaLabel = input<string | undefined>();

	private readonly host: HTMLElement;
	private iconSpan: HTMLSpanElement | undefined = undefined;
	private readonly renderer = inject(Renderer2);
	private readonly iconRegistry = inject(MatIconRegistry);

	constructor() {
		const elementRef = inject(ElementRef);

		this.host = elementRef.nativeElement;
	}

	ngOnChanges(): void {
		if (this.iconSpan) {
			this.removeIcon(this.iconSpan, this.host);
		}
		this.registerIcon(this.iconName(), this.host, this.iconPosition());
	}

	private registerIcon(iconName: string | undefined, host: HTMLElement, iconPosition: OptionLabelIconPosition): void {
		if (typeof iconName === 'string' && iconName.length > 0 && host) {
			this.iconRegistry
				.getNamedSvgIcon(iconName)
				.pipe(first())
				.subscribe(svg => {
					this.iconSpan = this.createIconElement(svg, host, iconPosition, this.ariaLabel());
					this.addIcon(iconName, this.iconSpan, host, iconPosition);
				});
		}
	}

	private addIcon(
		iconName: string,
		iconSpan: HTMLSpanElement,
		host: HTMLElement,
		position: OptionLabelIconPosition
	): void {
		if (iconName && iconSpan) {
			if (position === 'start') {
				this.renderer.insertBefore(host, iconSpan, host.firstChild);
			} else if (position === 'end') {
				this.renderer.appendChild(host, iconSpan);
			} else {
				this.removeIcon(iconSpan, host);
			}
		}
	}

	private removeIcon(iconSpanElement: HTMLSpanElement, host: HTMLElement): void {
		this.renderer.removeChild(host, iconSpanElement);
	}

	private createIconElement(
		svg: SVGElement,
		host: HTMLElement,
		iconPosition: OptionLabelIconPosition,
		ariaLabel?: string
	): HTMLSpanElement {
		const span = this.renderer.createElement('span');
		this.renderer.addClass(span, 'mat-icon');
		if (ariaLabel) {
			this.renderer.setAttribute(span, 'aria-label', ariaLabel);
		} else {
			this.renderer.setAttribute(span, 'aria-hidden', 'true');
		}
		this.setupIconPositionStyle(span, host, iconPosition);
		this.renderer.appendChild(span, svg);
		return span;
	}

	private setupIconPositionStyle(
		span: HTMLSpanElement,
		host: HTMLElement,
		iconPosition: OptionLabelIconPosition
	): void {
		if (iconPosition === 'end') {
			this.renderer.setStyle(host, 'align-items', 'center');
			this.renderer.setStyle(span, 'margin-left', 'auto');
		}
		if (['start', 'end'].includes(iconPosition)) {
			this.renderer.setStyle(host, 'display', 'flex');
		} else {
			this.removeIcon(span, host);
		}
	}
}
