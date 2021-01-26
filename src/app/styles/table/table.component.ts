import {Component} from '@angular/core';

@Component({
	selector: 'ob-table',
	templateUrl: './table.component.html'
})
export class ObTableComponent {
	oblique = true;
	cicd = false;
	hover = true;
	plain = false;
	collapse = true;
	size = 'medium';
}
