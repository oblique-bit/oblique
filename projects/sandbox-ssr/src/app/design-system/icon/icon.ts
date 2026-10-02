import {CUSTOM_ELEMENTS_SCHEMA, Component} from '@angular/core';
import {iconsRegistry} from '@oblique/design-system';

@Component({
	selector: 'ssr-icon',
	imports: [],
	templateUrl: './icon.html',
	styleUrl: './icon.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Icon {
	icons = iconsRegistry.getAllIconKeys();
}
