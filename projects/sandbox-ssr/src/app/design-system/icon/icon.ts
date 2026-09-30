import {CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';
// @ts-expect-error Fix when `npm i` will work again
import {iconsRegistry} from '@oblique/design-system';

@Component({
	selector: 'ssr-icon',
	imports: [],
	templateUrl: './icon.html',
	styleUrl: './icon.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Icon {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	icons = iconsRegistry.getAllIconKeys();
}
