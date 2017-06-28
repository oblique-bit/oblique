import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'or-filter-box',
	templateUrl: './filter-box.component.html',
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
	patternChanged = new EventEmitter<string>();

	@Output()
	patternCleared = new EventEmitter();

	onPatternCleared() {
		this.pattern = undefined;
		this.patternCleared.emit();
		this.patternChanged.emit();
	}

	onPatternChanged(pattern) {
		this.pattern = pattern;
		this.patternChanged.emit(this.pattern);
	}
}
