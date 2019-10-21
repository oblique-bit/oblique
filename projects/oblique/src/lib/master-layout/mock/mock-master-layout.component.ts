import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ORNavigationLink} from '../master-layout-navigation/master-layout-navigation.component';

@Component({
	selector: 'or-master-layout',
	exportAs: 'orMasterLayout',
	template: ''
})
export class MockMasterLayoutComponent {
	home = '';
	url: string;
	@Input() navigation: ORNavigationLink[] = [];
	isFixed = true;
	hasCover = true;
	isMenuCollapsed = true;
	noNavigation = true;
	hasOffCanvas = true;
	footerSm = true;
	isScrolling = false;
	readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	readonly offCanvasClose: ElementRef<HTMLElement>;
}
