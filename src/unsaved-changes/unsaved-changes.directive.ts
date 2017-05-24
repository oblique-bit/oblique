import {AfterContentInit, Directive, ElementRef, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {UnsavedChangesService} from './unsaved-changes.service';
import {NgbTab, NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';

@Directive({
	selector: '[orUnsavedChanges]'
})
export class UnsavedChangesDirective implements OnDestroy, OnInit, AfterContentInit {
	@Input() id;

	constructor(private unsavedChangesService: UnsavedChangesService,
				private form: ControlContainer,
				@Optional() private ngbTab: NgbTab,
				@Optional() private ngbTabset: NgbTabset) {
	}

	ngOnInit() {
		let id = this.ngbTab ? this.ngbTab.id : this.id;
		this.unsavedChangesService.watch(id, this.form);
	}

	ngAfterContentInit() {
		if (this.ngbTab) {
			this.ngbTabset.destroyOnHide = false;
			this.unsavedChangesService.listenTo(this.ngbTabset);
		}
	}

	ngOnDestroy() {
		let id = this.ngbTab ? this.ngbTab.id : this.id;
		this.unsavedChangesService.unWatch(id);
	}
}
