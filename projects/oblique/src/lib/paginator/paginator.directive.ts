import {AfterContentInit, Directive, ElementRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {ObSelectPanelClassHelper} from '../form-field/select-panel-class-helper';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-paginator',
	host: {class: 'ob-paginator'},
	standalone: true
})
export class ObPaginatorDirective implements AfterContentInit {
	private readonly host: HTMLAnchorElement;

	constructor(elRef: ElementRef, private readonly paginator: MatPaginator) {
		this.host = elRef.nativeElement;
	}

	ngAfterContentInit(): void {
		ObSelectPanelClassHelper.ensureAdditionalClassesAreIncluded(this.host, this.paginator.selectConfig);
	}
}
