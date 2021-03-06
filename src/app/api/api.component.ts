import {Component, Input, OnInit} from '@angular/core';
import {ObIAPI} from './api.model';

@Component({
	selector: 'ob-api',
	templateUrl: './api.component.html',
	styleUrls: ['./api.component.scss']
})
export class ObApiComponent implements OnInit {
	@Input() component: string;
	@Input() directory: string;
	api: ObIAPI[];

	ngOnInit() {
		this.api = require(`../../../projects/oblique/src/lib/${this.directory || this.component}/${this.component}.api.json`).api;
	}
}
