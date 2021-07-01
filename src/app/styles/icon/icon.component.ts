import {Component} from '@angular/core';
import {ObEIcon} from 'oblique';

@Component({
	selector: 'ob-icon-sample',
	templateUrl: './icon.component.html'
})
export class ObIconSampleComponent {
	icons = Object.values(ObEIcon);
}
