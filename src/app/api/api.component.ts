import {Component, Input, OnInit} from '@angular/core';

export interface API {
	name: string;
	selector?: string;
	exported?: string;
	usage?: string;
	since: string;
	variables?: APIelement[];
	inputs?: APIelement[];
	outputs?: APIelement[];
	methods?: APIelement[];
	projection?: APIelement[];
	internationalization?: APIelement[];
}

export interface APIelement {
	name: string;
	text: string;
	type?: string;
	values?: any[];
	arguments?: string[];
	returns?: string;
	see?: string;
	default?: any;
	since: string;
}

@Component({
	selector: 'or-api',
	templateUrl: './api.component.html',
	styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
	@Input() component: string;
	@Input() directory: string;
	api: API[];

	ngOnInit() {
		this.api = require(`../../../projects/oblique/src/lib/${this.directory || this.component}/${this.component}.api.json`);
	}
}
