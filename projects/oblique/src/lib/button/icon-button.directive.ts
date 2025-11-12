import {Directive, ElementRef, Renderer2, effect, inject, isDevMode} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

@Directive({
	standalone: true,
})
export class ObIconButtonDirective {
	private readonly isIconButton = Boolean(inject(MatIconButton, {optional: true}));
	private readonly hasTooltip = Boolean(inject(MatTooltip, {optional: true}));
	private readonly renderer = inject(Renderer2);
	private readonly element = inject(ElementRef<HTMLButtonElement>);

	constructor() {
		if (this.isIconButton) {
			this.ensureVisibleText(this.element.nativeElement);
		}
	}

	private ensureVisibleText(button: HTMLButtonElement): void {
		if (this.hasTooltip) {
			this.observeAriaDescribedbyChange(button);
		} else if (isDevMode()) {
			effect(() => {
				console.warn(
					'The following button lacks visible text. For improved usability and accessibility, consider adding a tooltip to clarify its purpose.',
					button
				);
			});
		}
	}

	private observeAriaDescribedbyChange(button: HTMLButtonElement): void {
		const observer = new MutationObserver(mutations => {
			const mutation = mutations
				.map(() => button.getAttribute('aria-describedby'))
				.find(aria => aria.includes('cdk-describedby-message'));
			if (mutation) {
				observer.disconnect();
				this.adaptAriaAttributes(mutation);
			}
		});
		observer.observe(button, {attributeFilter: ['aria-describedby']});
	}

	private adaptAriaAttributes(ids: string): void {
		const target = ids.split(' ').find(id => id.startsWith('cdk-describedby-message'));
		this.renderer.setAttribute(this.element.nativeElement, 'aria-labelledby', target);
		if (target === ids) {
			this.renderer.removeAttribute(this.element.nativeElement, 'aria-describedby');
		} else {
			this.renderer.setAttribute(this.element.nativeElement, 'aria-describedby', ids.replace(target, '').trim());
		}
	}
}
