import {Component} from '@angular/core';
import {ObEIcon} from '@oblique/oblique';

@Component({
	selector: 'ob-icon-sample',
	templateUrl: './icon.sample.component.html',
	styleUrls: ['./icon.sample.component.scss']
})
export class ObIconSampleComponent {
	color = '#171717';
	fontSize = '16';
	icons = Object.values(ObEIcon);
}
