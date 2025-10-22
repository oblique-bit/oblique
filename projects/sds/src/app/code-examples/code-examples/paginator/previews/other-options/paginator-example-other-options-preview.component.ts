import {type AfterViewInit, Component, viewChild} from '@angular/core';
import {type MatPaginator, MatPaginatorModule, type PageEvent} from '@angular/material/paginator';
import {JsonPipe} from '@angular/common';

@Component({
	selector: 'app-paginator-example-other-options-preview',
	imports: [JsonPipe, MatPaginatorModule],
	templateUrl: './paginator-example-other-options-preview.component.html',
	styleUrls: ['../paginator-example-preview.component.scss', '../../../../code-example-flex-layout.scss'],
	host: {class: 'layout-column'}
})
export class PaginatorExampleOtherOptionsPreviewComponent implements AfterViewInit {
	initializedText = 'Paginator has not yet been initialized';
	lastPageEvent: PageEvent;
	private readonly initializedPaginator = viewChild.required<MatPaginator>('initialized');

	ngAfterViewInit(): void {
		this.initializedPaginator().initialized.subscribe(() => (this.initializedText = 'Paginator has now been initialized'));
	}
}
