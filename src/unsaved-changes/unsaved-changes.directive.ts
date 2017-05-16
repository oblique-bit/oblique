import {Directive, OnDestroy} from '@angular/core';
import {UnsavedChangesService} from './unsaved-changes.service';
import {ControlContainer} from '@angular/forms';

@Directive({
	selector: '[orUnsavedChanges]'
})
export class UnsavedChangesDirective implements OnDestroy {

	constructor(private unsavedChangesService: UnsavedChangesService, private form: ControlContainer) {
		unsavedChangesService.watch(form);
	}

	ngOnDestroy() {
		this.unsavedChangesService.unWatch(this.form);
	}
}
