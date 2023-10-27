import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {ObPaginatorDirective} from '@oblique/oblique';
import {JsonPipe} from '@angular/common';

@Component({
	selector: 'app-paginator-example-other-options-preview',
	templateUrl: './paginator-example-other-options-preview.component.html',
	styleUrls: ['../paginator-example-preview.component.scss', '../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [JsonPipe, MatPaginatorModule, ObPaginatorDirective],
	host: {class: 'layout-column flex-end'}
})
export class PaginatorExampleOtherOptionsPreviewComponent implements AfterViewInit {
	initializedText = 'Paginator has not yet been initialized';
	lastPageEvent: PageEvent;
	@ViewChild('initialized') private readonly initializedPaginator!: MatPaginator;

	ngAfterViewInit(): void {
		this.initializedPaginator.initialized.subscribe(() => (this.initializedText = 'Paginator has now been initialized'));
	}
}
