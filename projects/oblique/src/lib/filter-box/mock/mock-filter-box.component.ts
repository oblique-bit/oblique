import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
	selector: 'ob-filter-box',
	exportAs: 'obFilterBox',
	template: ''
})
export class ObMockFilterBoxComponent {
	material: Observable<boolean>;
	@Input() pattern: string;
	@Input() placeholder = 'i18n.common.filter.placeholder';
	@Input() size: string;
	@Input() disabled: boolean;
	@Input() readonly: boolean;
	@Input() modelOptions: any;
	@Output() patternChange = new EventEmitter<string>();
	@Output() patternClear = new EventEmitter<void>();

	onPatternCleared(): void {
	}

	onPatternChanged(pattern: string): void {
	}

	getSizeClass(classPattern: string): string {
		return '';
	}
}
