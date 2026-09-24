import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-table',
	standalone: false,
	templateUrl: './table.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TableComponent {
	oblique = true;
	hover = true;
	plain = false;
	collapse = true;
	size = 'medium';
}
