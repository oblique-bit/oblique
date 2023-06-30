import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
	standalone: true,
	selector: 'app-badge-example-default',
	templateUrl: './paginator.component.html',
	imports: [MatPaginatorModule]
})
export class PaginatorComponent implements PreviewComponent {}
