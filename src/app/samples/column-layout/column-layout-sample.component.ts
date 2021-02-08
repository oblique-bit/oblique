import {Component} from '@angular/core';
import {ObINavigationLink, ObISearchWidgetItem} from 'oblique';

@Component({
	selector: 'ob-column-layout-sample',
	templateUrl: 'column-layout-sample.component.html'
})
export class ObColumnLayoutSampleComponent {
	left = true;
	right = true;
	noLayout = false;
	wider = false;
}
