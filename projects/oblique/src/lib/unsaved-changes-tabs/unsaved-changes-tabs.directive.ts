import {AfterContentInit, Directive, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbTab, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesTabsService} from './unsaved-changes-tabs.service';

@Directive({
	selector: '[orUnsavedChangesTabs]'
})
export class UnsavedChangesTabsDirective implements OnDestroy, OnInit, AfterContentInit {
	@Input() id;

	constructor(private readonly unsavedChangesService: UnsavedChangesTabsService,
				private readonly form: ControlContainer,
				@Optional() private readonly ngbTab: NgbTab,
				@Optional() private readonly ngbTabset: NgbTabset) {
	}

	ngOnInit() {
		const id = this.ngbTab ? this.ngbTab.id : this.id;
		if (!id) {
			throw new Error('orUnsavedChanges directive needs either to be within a NgbTab directive or to have an "id" attribute.');
		}
		this.unsavedChangesService.watch(id, this.form);
	}

	ngAfterContentInit() {
		if (this.ngbTab) {
			this.ngbTabset.destroyOnHide = false;
			this.unsavedChangesService.listenTo(this.ngbTabset);
		}
	}

	ngOnDestroy() {
		const id = this.ngbTab ? this.ngbTab.id : this.id;
		this.unsavedChangesService.unWatch(id);
		this.unsavedChangesService.unListenTo(this.ngbTabset);
	}
}
