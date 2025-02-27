import {Component} from '@angular/core';

@Component({
	selector: 'sb-table',
	templateUrl: './table.component.html',
	standalone: false
})
export class TableComponent {
	oblique = true;
	hover = true;
	plain = false;
	collapse = true;
	size = 'medium';
}
