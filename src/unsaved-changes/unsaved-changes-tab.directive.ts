import {Directive, OnDestroy} from '@angular/core';
import {UnsavedChangesService} from './unsaved-changes.service';
import {NgbTabset, NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Directive({
	selector: '[unsavedChangesTab]'
})
export class UnsavedChangesTabDirective implements OnDestroy {

	constructor(private unsavedChangesService: UnsavedChangesService, private tabset: NgbTabset) {
		tabset.tabChange.subscribe((event: NgbTabChangeEvent) => {
			if (this.unsavedChangesService.checkForTabChanges())
				event.preventDefault();
		});
	}

	ngOnDestroy() {
		// this.unsavedChangesService.unWatch(this.form);
	}
}
