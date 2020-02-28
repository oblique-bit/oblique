import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObILocaleObject} from '../master-layout.config';
import {ObINavigationLink} from '../master-layout.module';

@Component({
	selector: 'ob-master-layout-header',
	template: ''
})
export class ObMockMasterLayoutHeaderComponent {
	home = '';
	locales: ObILocaleObject[];
	isCustom = true;
	disabledLang = true;
	@Input() navigation: ObINavigationLink[];
	isAnimated = true;
	isSticky = true;
	isMedium = true;
	readonly templates: QueryList<TemplateRef<any>>;
	readonly headerControl: QueryList<ElementRef>;

	onResize(): void {
	}

	isLangActive(lang: string): boolean {
		return true;
	}

	changeLang(lang: string): void {
	}
}
