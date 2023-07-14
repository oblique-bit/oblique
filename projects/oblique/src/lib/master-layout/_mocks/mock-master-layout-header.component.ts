import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';
import {ObILocaleObject} from '../master-layout.model';
import {of} from 'rxjs';
import {ObLoginState} from '../../service-navigation/service-navigation.model';

@Component({
	selector: 'ob-master-layout-header',
	exportAs: 'obMasterLayoutHeader',
	template: ''
})
export class ObMockMasterLayoutHeaderComponent {
	home$ = of('');
	languages: ObILocaleObject[];
	isCustom = true;
	banner = {};
	@Input() navigation: ObINavigationLink[];
	isMedium = true;
	readonly templates: QueryList<TemplateRef<any>>;
	readonly headerControl: QueryList<ElementRef>;

	isLangActive(lang: string): boolean {
		return true;
	}

	changeLang(lang: string): void {}

	emitLoginState(loginState: ObLoginState): void {}
}
