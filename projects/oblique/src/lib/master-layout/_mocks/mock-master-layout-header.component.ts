import {Component, ElementRef, Input, QueryList, TemplateRef} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';
import {of} from 'rxjs';
import {ObLoginState} from '../../service-navigation/service-navigation.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-header',
	exportAs: 'obMasterLayoutHeader',
	template: ''
})
export class ObMockMasterLayoutHeaderComponent {
	home$ = of('');
	isCustom = true;
	banner = {};
	@Input() navigation: ObINavigationLink[];
	isMedium = true;
	readonly templates: QueryList<TemplateRef<any>>;
	readonly headerControl: QueryList<ElementRef>;

	emitLoginState(loginState: ObLoginState): void {}
}
