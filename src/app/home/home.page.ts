import {Component} from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss']
})
export class HomePageComponent {
	version: string;

	constructor() {
		this.version = require('package.json').version;
	}
}
