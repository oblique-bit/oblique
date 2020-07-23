import {Component, Input, OnInit} from '@angular/core';

export interface ObIAPI {
	name: string;
	selector?: string;
	exported?: string;
	usage?: string;
	type?: string;
	since: string;
	updated?: string;
	variables?: ObIAPIelement[];
	inputs?: ObIAPIelement[];
	outputs?: ObIAPIelement[];
	methods?: ObIAPIelement[];
	projection?: ObIAPIelement[];
	internationalization?: ObIAPIelement[];
	tokens?: ObIAPIelement[];
}

export interface ObIAPIelement {
	name: string;
	text: string;
	type?: string;
	values?: any[];
	arguments?: string[];
	returns?: string;
	see?: string;
	default?: any;
	since: string;
	updated?: string;
	isOptional?: boolean;
}

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
