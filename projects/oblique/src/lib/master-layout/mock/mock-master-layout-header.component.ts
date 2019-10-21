import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {LocaleObject} from '../master-layout.config';
import {ORNavigationLink} from '../master-layout.module';

@Component({
	selector: 'or-master-layout-header',
	template: ''
})
export class MockMasterLayoutHeaderComponent {
	home = '';
	locales: LocaleObject[];
	isCustom = true;
	disabledLang = true;
	@Input() navigation: ORNavigationLink[];
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
