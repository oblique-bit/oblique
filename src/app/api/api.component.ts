import {Component, Input, OnInit} from '@angular/core';
import {ObIAPI} from './api.model';

@Component({
	selector: 'sc-api',
	templateUrl: './api.component.html',
	styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
	@Input() component: string;
	@Input() directory: string;
	api: ObIAPI[];

	ngOnInit(): void {
		if (this.component && this.directory) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			this.api = require(`../../../projects/oblique/src/lib/${this.directory || this.component}/${this.component}.api.json`).api;
		}
	}
}
