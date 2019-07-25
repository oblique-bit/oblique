import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {UnsavedChangesService} from './unsaved-changes.service';

@Directive({
	selector: '[orUnsavedChanges]'
})
export class UnsavedChangesDirective implements OnDestroy, OnInit {
	@Input() id;

	constructor(private readonly unsavedChangesService: UnsavedChangesService,
				private readonly form: ControlContainer) {
	}

	ngOnInit() {
		if (!this.id) {
			throw new Error('orUnsavedChanges directive needs an "id" attribute.');
		}
		this.unsavedChangesService.watch(this.id, this.form);
	}

	ngOnDestroy() {
		this.unsavedChangesService.unWatch(this.id);
	}
}
