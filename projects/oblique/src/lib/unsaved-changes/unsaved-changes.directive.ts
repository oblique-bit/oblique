import {Directive, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {ObUnsavedChangesService} from './unsaved-changes.service';

@Directive({
	selector: '[obUnsavedChanges]',
	exportAs: 'obUnsavedChanges',
	host: {class: 'ob-unsaved-changes'},
	standalone: true
})
export class ObUnsavedChangesDirective implements OnChanges, OnInit, OnDestroy {
	@Input() id: string;
	@Input() isActive = true;

	constructor(
		private readonly unsavedChangesService: ObUnsavedChangesService,
		private readonly form: ControlContainer
	) {}

	ngOnChanges(): void {
		if (this.id) {
			if (this.isActive) {
				this.unsavedChangesService.watch(this.id, this.form);
			} else {
				this.unsavedChangesService.unWatch(this.id);
			}
		}
	}

	ngOnInit(): void {
		if (!this.id) {
			throw new Error('obUnsavedChanges directive needs an "id" attribute.');
		}
	}

	ngOnDestroy(): void {
		this.unsavedChangesService.unWatch(this.id);
	}
}
