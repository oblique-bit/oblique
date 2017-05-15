import {Component} from '@angular/core';

@Component({
	selector: 'layout-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class LayoutNavigationComponent {

	public context = { // TODO: mock only, remove this
		isAuthenticated: false
	};
}
