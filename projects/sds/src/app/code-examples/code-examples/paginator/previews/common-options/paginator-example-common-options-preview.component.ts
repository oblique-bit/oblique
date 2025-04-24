import {Component} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ObPaginatorModule} from '@oblique/oblique';

@Component({
	selector: 'app-paginator-example-common-options-preview',
	templateUrl: './paginator-example-common-options-preview.component.html',
	styleUrls: ['../paginator-example-preview.component.scss', '../../../../code-example-flex-layout.scss'],
	imports: [MatPaginatorModule, ObPaginatorModule],
	host: {class: 'layout-column'}
})
export class PaginatorExampleCommonOptionsPreviewComponent {}
