import {Directive, OnDestroy} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {UnsavedChangesService} from './unsaved-changes.service';

@Directive({
	selector: 'unsavedChanges'
})
export class UnsavedChangesDirective implements OnDestroy {

	constructor(private unsavedChangesService: UnsavedChangesService, private form: ControlContainer) {
		this.unsavedChangesService.watch(this.form);
	}

	ngOnDestroy() {
		this.unsavedChangesService.unWatch(this.form);
	}
}
