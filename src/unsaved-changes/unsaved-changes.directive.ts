import {Directive, OnDestroy, Input} from '@angular/core';
import {UnsavedChangesService} from './unsaved-changes.service';
import {ControlContainer} from '@angular/forms';

@Directive({
	selector: '[unsavedChanges]'
})
export class UnsavedChangesDirective implements OnDestroy {
	@Input('unsavedChanges') tabId: string;

	constructor(private unsavedChangesService: UnsavedChangesService, private form: ControlContainer) {
	}

	ngOnInit() {
		this.unsavedChangesService.watch(this.form, this.tabId);
	}

	ngOnDestroy() {
		this.unsavedChangesService.unWatch(this.form);
	}
}
