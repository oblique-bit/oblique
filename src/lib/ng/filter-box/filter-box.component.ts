import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
	selector: 'or-filter-box',
	exportAs: 'orFilterBox',
	template: `
		<div class="input-group" [ngClass]="getSizeClass('input-group-')">
			<ng-content select=".input-group-prepend"></ng-content>
			<input class="form-control" [ngClass]="getSizeClass('form-control-')" type="text"
				   name="filterPattern" placeholder="{{placeholder | translate}}"
				   [attr.readonly]="readonly" [attr.disabled]="disabled"
				   [ngModel]="pattern" (ngModelChange)="onPatternChanged($event)" [ngModelOptions]="modelOptions"
				   #filterControl>
			<button type="button" role="button"
					[orTextControlClear]="filterControl"
					(onClear)="onPatternCleared();">
				<span class="fa fa-times-circle"></span>
				<span class="sr-only">{{'i18n.common.clear' | translate}}</span>
			</button>
			<ng-content select=".input-group-append"></ng-content>
		</div>
	`,
	styles: [`
		:host {
			display: block;
		}
	`]
})
export class FilterBoxComponent implements OnInit {

	@Input()
	pattern: string;

	@Input()
	placeholder = 'i18n.common.filter.placeholder';

	@Input()
	size: string;

	@Input()
	disabled: boolean;

	@Input()
	readonly: boolean;

	@Input()
	modelOptions: any; // See https://angular.io/api/forms/NgModel#options

	@Output()
	patternChange = new EventEmitter<string>();

	@Output()
	patternClear = new EventEmitter<void>();

	@ViewChild('filterControl')
	public filterControl: ElementRef;

	private readonly acceptedSizes = ['sm', 'lg'];

	ngOnInit(): void {
		if (this.size && this.acceptedSizes.indexOf(this.size) === -1) {
			throw new Error(`"${this.size}" is not a valid size. Only "lg" and "sm" are acceptable alternatives.`);
		}
	}

	onPatternCleared() {
		this.pattern = undefined;
		this.patternClear.emit();
		this.patternChange.emit();
	}

	onPatternChanged(pattern) {
		this.pattern = pattern;
		this.patternChange.emit(this.pattern);
	}

	getSizeClass(classPattern: string): string {
		return this.size
			? classPattern + this.size
			: '';
	}
}
