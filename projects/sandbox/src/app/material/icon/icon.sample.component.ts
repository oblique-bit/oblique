import {Component} from '@angular/core';
import {ObEIcon} from '@oblique/oblique';

@Component({
	selector: 'sb-icon-sample',
	templateUrl: './icon.sample.component.html',
	styleUrls: ['./icon.sample.component.scss']
})
export class IconSampleComponent {
	color = '#171717';
	fontSize = '16';
	icons = Object.values(ObEIcon);
}
