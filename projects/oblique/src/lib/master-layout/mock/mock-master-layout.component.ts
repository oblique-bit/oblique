import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObNavigationLink} from '../master-layout-navigation/master-layout-navigation.component';

@Component({
	selector: 'ob-master-layout',
	exportAs: 'obMasterLayout',
	template: ''
})
export class ObMockMasterLayoutComponent {
	home = '';
	url: string;
	@Input() navigation: ObNavigationLink[] = [];
	isFixed = true;
	hasCover = true;
	hasLayout = true;
	isMenuCollapsed = true;
	noNavigation = true;
	hasOffCanvas = true;
	footerSm = true;
	isScrolling = false;
	readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	readonly offCanvasClose: ElementRef<HTMLElement>;
}
