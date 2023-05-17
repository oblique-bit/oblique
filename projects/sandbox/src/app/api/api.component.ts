import {Component, Input, OnInit} from '@angular/core';
import {ObIAPI} from './api.model';

@Component({
	selector: 'sb-api',
	templateUrl: './api.component.html',
	styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
	@Input() component: string;
	api: ObIAPI[];

	ngOnInit(): void {
		if (this.component) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			this.api = require(`../../../../oblique/src/lib/${this.component}/${this.component}.api.json`).api;
		}
	}
}
