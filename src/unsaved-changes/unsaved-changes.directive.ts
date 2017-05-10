import {Directive, ElementRef, OnDestroy} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {UnsavedChangesService} from './unsaved-changes.service';

@Directive({
	selector: '[unsavedChanges]'
})
export class UnsavedChangesDirective implements OnDestroy {
	private formId;

	constructor(el: ElementRef, private unsavedChangesService: UnsavedChangesService, private form: ControlContainer) {
		this.formId = $(el.nativeElement).attr('id') || $(el.nativeElement).attr('name');
		this.unsavedChangesService.watch(this.formId, this.form);
	}

	ngOnDestroy() {
		this.unsavedChangesService.unWatch(this.formId);
	}
}
