import {Component} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
	selector: 'app-paginator-example-common-options-preview',
	imports: [MatPaginatorModule],
	templateUrl: './paginator-example-common-options-preview.component.html',
	styleUrls: ['../paginator-example-preview.component.scss', '../../../../code-example-flex-layout.scss'],
	host: {class: 'layout-column'}
})
export class PaginatorExampleCommonOptionsPreviewComponent {}
