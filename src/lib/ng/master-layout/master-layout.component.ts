import {Component, OnInit, Input} from '@angular/core';

@Component({
	selector: 'or-master-layout',
	templateUrl: './master-layout.component.html',
	styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent implements OnInit {
	@Input() home = '/home';


	constructor() {
	}

	ngOnInit() {
	}

}
