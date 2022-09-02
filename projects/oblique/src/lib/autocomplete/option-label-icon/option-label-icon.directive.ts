import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {first, tap} from 'rxjs/operators';

import {OptionLabelIconPosition} from '../autocomplete.model';
import {ObEIcon} from '../../icon/icon.model';

@Directive({
	selector: '[obOptionLabelIcon]',
	host: {class: 'ob-option-label-icon'}
})
export class ObOptionLabelIconDirective implements OnChanges {
	@Input() iconName?: ObEIcon;
	@Input() iconPosition: OptionLabelIconPosition = 'end';

	private readonly host: HTMLElement;
	private iconSpan: HTMLSpanElement;

	constructor(
		private readonly renderer: Renderer2,
		private readonly elementRef: ElementRef,
		private readonly iconRegistry: MatIconRegistry
	) {
		this.host = elementRef.nativeElement;
	}

	ngOnChanges(): void {
		if (this.iconSpan) {
			this.removeIcon(this.iconSpan, this.host);
		}
		this.registerIcon(this.iconName, this.host, this.iconPosition);
	}

	private registerIcon(iconName: string, host: HTMLElement, iconPosition: OptionLabelIconPosition): void {
		if (iconName.length > 0 && host) {
			this.iconRegistry
				.getNamedSvgIcon(iconName)
				.pipe(
					first(),
					tap(svg => (this.iconSpan = this.createIconElement(svg, host, iconPosition)))
				)
				.subscribe(() => {
					this.addIcon(iconName, this.iconSpan, host, iconPosition);
				});
		}
	}

	private addIcon(iconName: string, iconSpan: HTMLSpanElement, host: HTMLElement, position: OptionLabelIconPosition): void {
		if (iconName && iconSpan) {
			if (position === 'start') {
				this.renderer.insertBefore(host, iconSpan, host.firstChild);
			} else if (position === 'end') {
				this.renderer.appendChild(host, iconSpan);
			} else {
				this.removeIcon(this.iconSpan, this.host);
			}
		}
	}

	private removeIcon(iconSpanElement: HTMLSpanElement, host: HTMLElement): void {
		if (iconSpanElement) {
			this.renderer.removeChild(host, iconSpanElement);
		}
	}

	private createIconElement(svg: SVGElement, host: HTMLElement, iconPosition: OptionLabelIconPosition): HTMLSpanElement {
		const span = this.renderer.createElement('span');
		this.renderer.addClass(span, 'mat-icon');
		this.setupIconPositionStyle(span, host, iconPosition);
		this.renderer.appendChild(span, svg);
		return span;
	}

	private setupIconPositionStyle(span: HTMLSpanElement, host: HTMLElement, iconPosition: OptionLabelIconPosition): void {
		if (iconPosition === 'start') {
			this.renderer.setStyle(host, 'display', 'block');
		} else if (iconPosition === 'end') {
			this.renderer.setStyle(host, 'display', 'flex');
			this.renderer.setStyle(host, 'align-items', 'center');
			this.renderer.setStyle(span, 'margin-left', 'auto');
		} else {
			this.removeIcon(this.iconSpan, this.host);
		}
	}
}
