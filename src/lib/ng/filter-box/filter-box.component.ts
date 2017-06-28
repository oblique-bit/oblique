import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'or-filter-box',
	template: `
		<form novalidate>
			<div class="form-group">
				<div class="input-group">
					<ng-content select="[filter-box-before]"></ng-content>
					<div class="control-action">
						<input class="form-control" type="text"
							   placeholder="{{placeholder | translate}}"
							   [ngModel]="pattern" (ngModelChange)="onPatternChanged($event)" name="search" #filterControl>
						<button class="control-action-trigger" type="button" role="button"
								(click)="onPatternCleared(); filterControl.focus();">
							<span class="fa fa-times-circle"></span>
							<span class="sr-only">{{'i18n.common.clear' | translate}}</span>
						</button>
					</div>
					<ng-content select="[filter-box-after]"></ng-content>
				</div>
			</div>
		</form>
	`,
	styles: [`
		:host {
			display: block;
		}
		input[name="search"] {
			width: 100%;
		}
	`]
})
export class FilterBoxComponent {
	@Input()
	pattern: string;

	@Input()
	placeholder: string = 'i18n.common.search.placeholder';

	@Output()
	patternChange = new EventEmitter<string>();

	@Output()
	patternClear= new EventEmitter();

	onPatternCleared() {
		this.pattern = undefined;
		this.patternClear.emit();
		this.patternChange.emit();
	}

	onPatternChanged(pattern) {
		this.pattern = pattern;
		this.patternChange.emit(this.pattern);
	}
}
