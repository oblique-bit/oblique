import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
	selector: 'or-filter-box',
	exportAs: 'orFilterBox',
	templateUrl: './filter-box.component.html',
	styleUrls: ['./filter-box.component.scss']
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

	@ViewChild('filterControl', { static: true })
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
