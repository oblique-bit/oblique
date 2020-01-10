import {Component, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ThemeService} from '../theme/theme.service';

@Component({
	selector: 'or-filter-box',
	exportAs: 'orFilterBox',
	templateUrl: './filter-box.component.html'
})
export class FilterBoxComponent implements OnInit {
	material: Observable<boolean>;
	@Input() pattern: string;
	@Input() placeholder = 'i18n.common.filter.placeholder';
	@Input() size: string;
	@Input() disabled: boolean;
	@Input() readonly: boolean;
	@Input() modelOptions: any; // See https://angular.io/api/forms/NgModel#options
	@Output() patternChange = new EventEmitter<string>();
	@Output() patternClear = new EventEmitter<void>();
	@ViewChild('filterControl') filterControl: ElementRef;
	@ViewChild('inputGroup') inputGroup: ElementRef;
	@ContentChildren('prepend') readonly prepends: QueryList<TemplateRef<any>>;
	@ContentChildren('append') readonly appends: QueryList<TemplateRef<any>>;

	private readonly acceptedSizes = ['sm', 'lg'];

	constructor(theme: ThemeService, private readonly renderer: Renderer2) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()), tap(() => this.addBootstrapClasses()));
	}

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

	private addBootstrapClasses() {
		setTimeout(() => {
			if (this.inputGroup && !this.inputGroup.nativeElement.classList.contains('bootstrapped')) {
				Array.from(this.inputGroup.nativeElement.querySelectorAll(
					['.input-group-prepend > :not(.btn):not(.dropdown)', '.input-group-append > :not(.btn):not(.dropdown)'])
				).forEach(el => this.renderer.addClass(el, 'input-group-text'));
				this.renderer.addClass(this.inputGroup.nativeElement, 'bootstrapped');
			}
		});
	}
}
