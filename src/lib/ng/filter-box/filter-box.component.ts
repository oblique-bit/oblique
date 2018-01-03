import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'or-filter-box',
	template: `
		<form novalidate>
			<div class="form-group">
				<div class="input-group" [ngClass]="getSizeClass('input-group-')">
					<ng-content class="input-group-prepend" select=".input-group-prepend"></ng-content>
					<div class="control-action">
						<input class="form-control" [ngClass]="getSizeClass('form-control-')" type="text"
							   placeholder="{{placeholder | translate}}" 
							   [attr.readonly]="readonly" [attr.disabled]="disabled"
							   [ngModel]="pattern" (ngModelChange)="onPatternChanged($event)" name="filter"
							   #filterControl>
						<button class="control-action-trigger" type="button" role="button"
								(click)="onPatternCleared(); filterControl.focus();">
							<span class="fa fa-times-circle"></span>
							<span class="sr-only">{{'i18n.common.clear' | translate}}</span>
						</button>
					</div>
					<ng-content select=".input-group-append"></ng-content>
				</div>
			</div>
		</form>
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
	size;

	@Input()
	disabled: boolean;

	@Input()
	readonly: boolean;

	@Output()
	patternChange = new EventEmitter<string>();

	@Output()
	patternClear = new EventEmitter<void>();

	private acceptedSizes = ['sm', 'lg'];

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
