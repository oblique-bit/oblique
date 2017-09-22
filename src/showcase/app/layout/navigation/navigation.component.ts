import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'layout-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class LayoutNavigationComponent {

	constructor(private router: Router) {
	}

	isActive(url) {
		return this.router.isActive(url, false);
	}
}
