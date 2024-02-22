import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObIDynamicSkipLink, ObINavigationLink, ObISkipLink} from '../master-layout.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout',
	exportAs: 'obMasterLayout',
	template: ''
})
export class ObMockMasterLayoutComponent {
	home = '';
	url: string;
	@Input() navigation: ObINavigationLink[] = [];
	@Input() skipLinks: ObISkipLink[] | ObIDynamicSkipLink[] = [];
	hasCover = true;
	hasLayout = true;
	isMenuOpened = true;
	noNavigation = true;
	hasOffCanvas = true;
	isScrolling = false;
	isFooterSticky = false;
	readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	readonly offCanvasClose: ElementRef<HTMLElement>;
}
