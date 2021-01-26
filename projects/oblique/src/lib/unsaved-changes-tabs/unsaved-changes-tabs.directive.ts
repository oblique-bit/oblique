import {AfterContentInit, Directive, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbNav, NgbNavItem} from '@ng-bootstrap/ng-bootstrap';
import {ObUnsavedChangesTabsService} from './unsaved-changes-tabs.service';

@Directive({
	selector: '[obUnsavedChangesTabs]'
})
export class ObUnsavedChangesTabsDirective implements OnDestroy, OnInit, AfterContentInit {
	@Input() id;

	constructor(
		private readonly unsavedChangesService: ObUnsavedChangesTabsService,
		private readonly form: ControlContainer,
		@Optional() private readonly ngbNavItem: NgbNavItem,
		@Optional() private readonly ngbNav: NgbNav
	) {}

	ngOnInit() {
		const id = this.ngbNavItem ? this.ngbNavItem.id : this.id;
		if (!id) {
			throw new Error('obUnsavedChanges directive needs either to be within a NgbNavItem directive or to have an "id" attribute.');
		}
		this.unsavedChangesService.watch(id, this.form);
	}

	ngAfterContentInit() {
		if (this.ngbNavItem) {
			this.ngbNav.destroyOnHide = false;
			this.unsavedChangesService.listenTo(this.ngbNav);
		}
	}

	ngOnDestroy() {
		const id = this.ngbNavItem ? this.ngbNavItem.id : this.id;
		this.unsavedChangesService.unWatch(id);
		this.unsavedChangesService.unListenTo(this.ngbNav);
	}
}
