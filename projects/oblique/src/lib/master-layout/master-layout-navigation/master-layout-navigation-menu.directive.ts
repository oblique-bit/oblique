import {Directive, ElementRef, HostBinding, Renderer2, inject} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu',
	host: {class: 'ob-master-layout-navigation-menu'}
})
export class ObMasterLayoutNavigationMenuDirective {
	@HostBinding('class.ob-has-opened-menu') public hasOpenedMenu = false;
	private counter = 0;
	private readonly renderer = inject(Renderer2);
	private readonly element = inject(ElementRef);

	menuOpened(): void {
		this.counter++;
		this.hasOpenedMenu = this.counter > 0;
		this.toggleBackdrop();
	}

	menuClosed(): void {
		this.counter--;
		this.hasOpenedMenu = this.counter > 0;
		this.toggleBackdrop();
	}

	private toggleBackdrop(): void {
		const header: HTMLElement = this.element.nativeElement.closest('.ob-master-layout-header');
		if (this.hasOpenedMenu) {
			this.renderer.addClass(header, 'ob-has-opened-menu');
		} else {
			this.renderer.removeClass(header, 'ob-has-opened-menu');
		}
	}
}
