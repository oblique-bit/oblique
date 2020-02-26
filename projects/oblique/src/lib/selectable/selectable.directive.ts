import {Directive, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {ObSelectableService} from './selectable.service';

@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable'
})
export class ObSelectableDirective implements OnInit {
	@Input() collection = 'unnamed';
	@Input() value: any;
	@Input() @HostBinding('class.ob-selected') selected = false;
	@HostBinding('style.cursor') readonly cursor = 'pointer';

	constructor(private readonly selectableService: ObSelectableService) {
		selectableService.collectionChange$.pipe(
			filter(event => !event.collection || event.collection === this.collection),
			map(event => event.value || [])
		).subscribe(values => {
			this.selected = values.includes(this.value);
		});
	}

	ngOnInit(): void {
		if (this.selected) {
			this.selectableService.addValue(this.value, this.collection);
		}
	}

	@HostListener('click')
	onClick(): void {
		this.selectableService.toggleValue(this.value, this.collection);
	}
}
