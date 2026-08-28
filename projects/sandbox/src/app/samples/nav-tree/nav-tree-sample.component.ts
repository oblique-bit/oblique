import {ChangeDetectionStrategy, Component, type WritableSignal, inject, linkedSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {ObNavTreeItemModel} from '@oblique/oblique';
import {map} from 'rxjs';

@Component({
	selector: 'sb-nav-tree-sample',
	standalone: false,
	templateUrl: './nav-tree-sample.component.html',
	styleUrl: './nav-tree-sample.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class NavTreeSampleComponent {
	public readonly items: WritableSignal<ObNavTreeItemModel[]>;

	public filter = {
		pattern: null,
		clear: (): void => {
			this.filter.pattern = null;
		},
	};
	public hasEmbeddedFilter = false;
	private readonly route = inject(ActivatedRoute);
	private readonly routeItems = toSignal(
		this.route.data.pipe(map(data => data.sample.navTree.items.map((item: object) => new ObNavTreeItemModel(item)))),
		{initialValue: []}
	);

	constructor() {
		this.items = linkedSignal(() => this.routeItems());
	}

	setDisabled(index: number): void {
		this.items.update(items => {
			items[index].disabled = !items[index].disabled;
			return [...items];
		});
	}
}
