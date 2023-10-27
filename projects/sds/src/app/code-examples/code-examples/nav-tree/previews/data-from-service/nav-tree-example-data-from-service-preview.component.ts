import {Component, OnInit, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {ObNavTreeItemModel, ObNavTreeModule} from '@oblique/oblique';
import {Observable, map} from 'rxjs';
import {DataService} from './nav-tree-data.service';

@Component({
	selector: 'app-nav-tree-example-data-from-service-preview',
	templateUrl: './nav-tree-example-data-from-service-preview.component.html',
	standalone: true,
	imports: [ObNavTreeModule, AsyncPipe]
})
export class NavTreeExampleDataFromServicePreviewComponent implements OnInit {
	items$: Observable<ObNavTreeItemModel[]>;
	private readonly dataService = inject(DataService);

	ngOnInit(): void {
		this.items$ = this.dataService.getData().pipe(map(data => data.map(item => new ObNavTreeItemModel(item))));
	}
}
