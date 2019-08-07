import {Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ThemeService} from '../theme.service';

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
	@ViewChild('filterControl', {static: false}) filterControl: ElementRef;
	@ViewChild('inputGroup', {static: false}) inputGroup: ElementRef;
	@ContentChild('prepend', {static: false}) readonly prepend: TemplateRef<any>;
	@ContentChild('append', {static: false}) readonly append: TemplateRef<any>;

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
				let prepend = true;
				Array.from(this.inputGroup.nativeElement.children).forEach((item: HTMLElement) => {
					if (!item.classList.contains('form-control') && !item.classList.contains('text-control-clear')) {
						if (item.classList.contains('btn') || item.classList.contains('dropdown')) {
							this.renderer.addClass(item, prepend ? 'input-group-prepend' : 'input-group-append');
						} else {
							const elt = this.renderer.createElement('span');
							this.renderer.addClass(elt, prepend ? 'input-group-prepend' : 'input-group-append');
							this.renderer.insertBefore(item.parentElement, elt, item);
							this.renderer.appendChild(elt, item);
							this.renderer.addClass(item, 'input-group-text');
						}
					}
					if (item.classList.contains('form-control')) {
						prepend = false;
					}
				});
				this.renderer.addClass(this.inputGroup.nativeElement, 'bootstrapped');
			}
		});
	}
}
