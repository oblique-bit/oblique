import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'layout-controls',
	templateUrl: './controls.component.html',
	styleUrls: ['./controls.component.css']
})
export class LayoutControlsComponent implements OnInit {

	public appController = { // TODO: mock only, remove this
		locale: {
			current: 'fr'
		},
		context: {
			user: {
				firstname: 'Oblique',
				lastname: 'Reactive'
			}
		}
	};
	public locales = ['fr', 'en']; // TODO: inject locales

	public isAuthenticated = false; // TODO: remove from here in favor of some global AUTH service

	constructor() {
		//
	}

	ngOnInit() {
		//
	}
}
