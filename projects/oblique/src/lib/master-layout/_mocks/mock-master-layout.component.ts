import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObINavigationLink} from '../master-layout.model';

@Component({
	selector: 'ob-master-layout',
	exportAs: 'obMasterLayout',
	template: ''
})
export class ObMockMasterLayoutComponent {
	home = '';
	url: string;
	@Input() navigation: ObINavigationLink[] = [];
	hasCover = true;
	hasLayout = true;
	isMenuCollapsed = true;
	noNavigation = true;
	hasOffCanvas = true;
	isScrolling = false;
	isFooterSticky = false;
	readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	readonly offCanvasClose: ElementRef<HTMLElement>;
}
