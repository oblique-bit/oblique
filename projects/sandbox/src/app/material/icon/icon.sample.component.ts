import {Component} from '@angular/core';
import {ObEIcon} from '@oblique/oblique';

@Component({
	selector: 'sb-icon-sample',
	standalone: false,
	templateUrl: './icon.sample.component.html',
	styleUrl: './icon.sample.component.scss'
})
export class IconSampleComponent {
	color = '#171717';
	fontSize = '16';
	icons = Object.values(ObEIcon);
}
