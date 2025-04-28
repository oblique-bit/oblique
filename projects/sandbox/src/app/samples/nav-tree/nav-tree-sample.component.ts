import {Component, Signal, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {ObNavTreeItemModel} from '@oblique/oblique';
import {map} from 'rxjs';

@Component({
	selector: 'sb-nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html',
	styleUrl: './nav-tree-sample.component.scss',
	standalone: false
})
export class NavTreeSampleComponent {
	public items: Signal<ObNavTreeItemModel[]>;

	public filter = {
		pattern: null,
		clear: (): void => {
			this.filter.pattern = null;
		}
	};
	public hasEmbeddedFilter = false;

	constructor() {
		const route = inject(ActivatedRoute);
		this.items = toSignal(route.data.pipe(map(data => data.sample.navTree.items.map(item => new ObNavTreeItemModel(item)))));
	}

	setDisabled(index: number): void {
		this.items()[index].disabled = !this.items()[index].disabled;
	}
}
