import {Component} from '@angular/core';

@Component({
	selector: 'sb-table',
	templateUrl: './table.component.html'
})
export class TableComponent {
	oblique = true;
	cicd = false;
	hover = true;
	plain = false;
	collapse = true;
	size = 'medium';
}
