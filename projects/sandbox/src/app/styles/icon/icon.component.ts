import {Component} from '@angular/core';
import {ObEIcon} from '@oblique/oblique';

@Component({
	selector: 'sb-icon-sample',
	templateUrl: './icon.component.html',
	standalone: false
})
export class IconSampleComponent {
	icons = Object.values(ObEIcon);
}
