import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-lists',
	standalone: false,
	templateUrl: './lists.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ListsComponent {}
