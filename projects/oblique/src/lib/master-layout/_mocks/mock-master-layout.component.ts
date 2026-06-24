import {
	Component,
	ElementRef,
	QueryList,
	TemplateRef,
	contentChild,
	contentChildren,
	input,
	output,
	viewChild,
} from '@angular/core';
import {ObIDynamicSkipLink, ObINavigationLink, ObISkipLink} from '../master-layout.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout',
	standalone: false,
	template: '',
	exportAs: 'obMasterLayout',
})
export class ObMockMasterLayoutComponent {
	home = '';
	url: string;
	readonly navigation = input<ObINavigationLink[]>([]);
	readonly skipLinks = input<ObISkipLink[] | ObIDynamicSkipLink[]>([]);
	readonly version = input<string>(undefined);
	readonly navigationChanged = output<ObINavigationLink[]>();
	readonly obLogo = contentChild<TemplateRef<unknown>>('obHeaderLogo');
	readonly headerControlTemplates = contentChildren<TemplateRef<unknown>>('obHeaderControl');
	readonly headerMobileControlTemplates = contentChildren<TemplateRef<unknown>>('obHeaderMobileControl');
	readonly footerLinkTemplates = contentChildren<TemplateRef<HTMLLinkElement>>('obFooterLink');
	readonly offCanvasClose = viewChild('offCanvasClose', {read: ElementRef});
	readonly main = viewChild<ElementRef<HTMLElement>>('main');
	readonly wrapper = viewChild<ElementRef<HTMLElement>>('wrapper');
	hasCover = true;
	hasLayout = true;
	isMenuOpened = true;
	noNavigation = true;
	hasOffCanvas = true;
	isScrolling = false;
	isFooterSticky = false;
}
