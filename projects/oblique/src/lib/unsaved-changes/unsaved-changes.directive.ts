import {Directive, OnChanges, OnDestroy, inject, input} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {ObUnsavedChangesService} from './unsaved-changes.service';

@Directive({
	selector: '[obUnsavedChanges]',
	host: {class: 'ob-unsaved-changes'},
	exportAs: 'obUnsavedChanges',
})
export class ObUnsavedChangesDirective implements OnChanges, OnDestroy {
	readonly id = input.required<string>();
	readonly isActive = input(true);
	private readonly unsavedChangesService = inject(ObUnsavedChangesService);
	private readonly form = inject(ControlContainer);

	// Keep activation per form; do not use an effect to propagate it to the service's global state.
	ngOnChanges(): void {
		// Guard against empty string id, which is falsy
		if (this.id()) {
			if (this.isActive()) {
				this.unsavedChangesService.watch(this.id(), this.form);
			} else {
				this.unsavedChangesService.unWatch(this.id());
			}
		}
	}

	ngOnDestroy(): void {
		// Guard against empty string id, which is falsy
		if (this.id()) {
			this.unsavedChangesService.unWatch(this.id());
		}
	}
}
