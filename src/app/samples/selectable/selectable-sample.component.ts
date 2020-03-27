import {Component, OnInit} from '@angular/core';
import {ObSelectableService} from 'oblique';
import {ObISelectableCollectionChanged} from 'projects/oblique/src/lib/selectable/selectable.service';
import {tap} from 'rxjs/operators';

@Component({
	selector: 'ob-selected',
	templateUrl: './selectable-sample.component.html',
	styleUrls: ['./selectable-sample.component.scss']
})
export class ObSelectableSampleComponent implements OnInit {
	collections = {};
	unnamedCollection: any[] = [];
	preselectionCollection: any[] = [];
	event: ObISelectableCollectionChanged;

	constructor(readonly selectedService: ObSelectableService) {}

	ngOnInit(): void {
		this.getCollections();
		this.selectedService.collectionChange$.pipe(tap(event => this.getCollections())).subscribe(event => {
			this.event = event;
		});
	}

	clearCollection(collection: string): void {
		this.selectedService.clearCollection(collection);
	}

	removeCollection(collection: string): void {
		this.selectedService.removeCollection(collection);
	}

	clearCollections(): void {
		this.selectedService.clearCollections();
	}

	private getCollections(): void {
		this.collections = this.map2Object(this.selectedService.getCollections());
		this.unnamedCollection = this.selectedService.getCollection('unnamed');
		this.preselectionCollection = this.selectedService.getCollection('preselection');
	}

	private map2Object(map: Map<string, any[]>): {[key: string]: any} {
		// because JSON pipe cannot display Maps
		const obj = {};
		map.forEach((value, key) => (obj[key] = value));
		return obj;
	}
}
