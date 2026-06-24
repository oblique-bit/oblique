import {
	Component,
	ElementRef,
	TemplateRef,
	contentChild,
	contentChildren,
	input,
	output,
	viewChildren,
} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';
import {of} from 'rxjs';
import {ObLoginState} from '../../service-navigation/service-navigation.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-header',
	standalone: false,
	template: '',
	exportAs: 'obMasterLayoutHeader',
})
export class ObMockMasterLayoutHeaderComponent {
	home$ = of('');
	isCustom = true;
	banner = {};
	readonly navigation = input<ObINavigationLink[]>(undefined);
	isMedium = true;
	readonly navigationChanged = output<ObINavigationLink[]>();
	readonly obLogo = contentChild<TemplateRef<unknown>>('obHeaderLogo');
	readonly templates = contentChildren<TemplateRef<unknown>>('obHeaderControl');
	readonly mobileTemplates = contentChildren<TemplateRef<unknown>>('obHeaderMobileControl');
	readonly headerControl = viewChildren<ElementRef>('headerControl');
	readonly headerMobileControl = viewChildren<ElementRef>('headerMobileControl');

	emitLoginState(loginState: ObLoginState): void {}
}
