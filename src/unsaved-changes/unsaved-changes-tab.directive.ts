import {
	AfterContentInit, ContentChildren, Directive, QueryList
} from '@angular/core';
import {UnsavedChangesService} from './unsaved-changes.service';
import {NgbTabset, NgbTabChangeEvent, NgbTab} from '@ng-bootstrap/ng-bootstrap';

@Directive({
	selector: '[unsavedChangesTab]'
})
export class UnsavedChangesTabDirective implements AfterContentInit {
	@ContentChildren(NgbTab) tabList: QueryList<NgbTab>;


	constructor(private unsavedChangesService: UnsavedChangesService, private tabSet: NgbTabset) {
	}

	ngAfterContentInit() {
		this.tabSet.tabChange.subscribe((event: NgbTabChangeEvent) => {
			let tab = this.tabList.filter((tab: NgbTab): boolean => tab.id === event.activeId);
			let form = $(tab[0].contentTpl.templateRef.elementRef.nativeElement).parents('form');

			if (!this.unsavedChangesService.canDeactivateTab(form.attr('id')))
				event.preventDefault();
		});
	}
}
