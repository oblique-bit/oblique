import {Component} from '@angular/core';

@Component({
	selector: 'sb-table',
	templateUrl: './table.component.html'
})
export class TableComponent {
	oblique = true;
	hover = true;
	plain = false;
	collapse = true;
	size = 'medium';
}
