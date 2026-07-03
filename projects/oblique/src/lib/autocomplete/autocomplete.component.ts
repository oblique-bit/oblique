import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {
	AfterViewInit,
	Component,
	DoCheck,
	ElementRef,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	Signal,
	ViewChild,
	ViewEncapsulation,
	booleanAttribute,
	computed,
	contentChildren,
	inject,
	input,
	output,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	FormsModule,
	NG_VALUE_ACCESSOR,
	NgControl,
	ReactiveFormsModule,
} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule, MatHint} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {Observable, Subject, debounceTime, shareReplay} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {
	ObIAutocompleteInputOption,
	ObIAutocompleteInputOptionGroup,
	OptionLabelIconPosition,
} from '../autocomplete/autocomplete.model';
import {ObMatErrorDirective} from '../error-messages/mat-error.directive';
import {ObErrorMessagesDirective} from '../error-messages/error-messages.directive';
import {ObInputClearDirective} from '../input-clear/input-clear.directive';
import {ObAutocompleteTextToFindService} from './autocomplete-text-to-find.service';
import {ObHighlightTextPipe} from './highlight-text/highlight-text.pipe';
import {ObOptionLabelIconDirective} from './option-label-icon/option-label-icon.directive';

@Component({
	selector: 'ob-autocomplete',
	imports: [
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		FormsModule,
		MatAutocompleteModule,
		ReactiveFormsModule,
		ObInputClearDirective,
		NgTemplateOutlet,
		MatOptionModule,
		ObOptionLabelIconDirective,
		AsyncPipe,
		ObHighlightTextPipe,
		TranslateModule,
		ObErrorMessagesDirective,
		ObMatErrorDirective,
	],
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ObAutocompleteComponent,
			multi: true,
		},
	],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-autocomplete'},
})
export class ObAutocompleteComponent<T = string>
	implements OnChanges, ControlValueAccessor, OnDestroy, AfterViewInit, DoCheck
{
	withErrorMessages = input(false, {transform: booleanAttribute});
	@Input() inputLabelKey = 'i18n.oblique.search.title';
	@Input() noResultKey = 'i18n.oblique.search.no-results';
	readonly autocompleteOptions = input<(ObIAutocompleteInputOption<T> | ObIAutocompleteInputOptionGroup<T>)[]>([]);
	readonly filterRegexFlag = input('gi');
	readonly highlightCssClass = input('ob-highlight-text');
	readonly optionIconPosition = input<OptionLabelIconPosition>('end');
	displayWith = input<(value: any) => string>(value => value);

	readonly selectedOptionChange = output<ObIAutocompleteInputOption<T>>();
	autocompleteInputControl = new FormControl<T | string>('', {updateOn: 'change'});
	filteredOptions$: Observable<(ObIAutocompleteInputOption<T> | ObIAutocompleteInputOptionGroup<T>)[]>;
	hasGroupOptions = false;
	readonly searchText$ = this.autocompleteInputControl.valueChanges.pipe(
		map(value => this.getStringValue(value)),
		shareReplay()
	);
	onModelTouched: () => void;
	readonly hints: Signal<{align: 'start' | 'end'; template: string}[]>;
	@ViewChild(MatAutocompleteTrigger) private readonly autocompleteTrigger?: MatAutocompleteTrigger;
	private readonly matHints = contentChildren(MatHint);
	private readonly matHintsElementRefs = contentChildren(MatHint, {read: ElementRef<HTMLElement>});
	private readonly unsubscribe = new Subject<void>();
	private readonly unsubscribeOptions = new Subject<void>();
	private readonly obAutocompleteTextToFindService = inject(ObAutocompleteTextToFindService);
	private readonly injector = inject(Injector);
	private readonly elementRef = inject(ElementRef<HTMLElement>);
	private lastRect?: DOMRect;

	constructor() {
		// MatHint cannot be projected into MatFormField because MatFormField’s content
		// projection is resolved before ObAutocomplete’s. As a result, MatHint elements
		// must already exist when the component initializes, and they must be populated
		// manually with the content of the projected MatHint elements
		this.hints = computed(() =>
			this.matHintsElementRefs().map((template, index) => ({
				align: this.matHints()[index].align,
				template: template.nativeElement.innerHTML,
			}))
		);
	}

	ngOnChanges(): void {
		this.setupOptionsFilter();
	}

	ngDoCheck(): void {
		if (!this.autocompleteTrigger?.panelOpen) {
			this.lastRect = undefined;
			return;
		}
		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		if (this.lastRect && (rect.top !== this.lastRect.top || rect.left !== this.lastRect.left)) {
			this.autocompleteTrigger.updatePosition();
		}
		this.lastRect = rect;
	}

	ngAfterViewInit(): void {
		if (this.withErrorMessages()) {
			const ngControl = this.injector.get(NgControl, null, {self: true, optional: true});
			this.autocompleteInputControl.setValidators(ngControl.control.validator);
			// tell Angular that this control now has new validators
			this.autocompleteInputControl.updateValueAndValidity();
			// cancel dirty and touched states set by updateValueAndValidity
			this.autocompleteInputControl.markAsPristine();
			this.autocompleteInputControl.markAsUntouched();
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.unsubscribeOptions.next();
		this.unsubscribeOptions.complete();
	}

	setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.autocompleteInputControl.disable();
		} else {
			this.autocompleteInputControl.enable();
		}
	}

	/**
	 * Write a new value to the element.
	 */
	writeValue(value: T): void {
		this.autocompleteInputControl.setValue(value);
		// when the value is reset, the options should also be reset
		if (value === null || value === undefined) {
			this.unsubscribeOptions.next(); // kill the current stream before creating a new one
			this.setupOptionsFilter();
		}
	}

	/**
	 * Set the function to be called
	 * when the control receives a change event.
	 */
	registerOnChange(fn: (v: unknown) => void): void {
		this.autocompleteInputControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(value => {
			fn(value);
		});
	}

	/**
	 * Set the function to be called
	 * when the control receives a touch event.
	 */
	registerOnTouched(fn: () => void): void {
		this.onModelTouched = fn;
		this.autocompleteInputControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
			this.autocompleteInputControl.markAllAsTouched();
		});
	}

	private getStringValue(value: T | string): string {
		return typeof value === 'string' ? value : this.displayWith()(value);
	}

	private setupOptionsFilter(): void {
		this.filteredOptions$ = this.autocompleteInputControl.valueChanges.pipe(
			takeUntil(this.unsubscribeOptions),
			startWith(''),
			debounceTime(200),
			map(searchValue => this.getStringValue(searchValue)),
			map((searchValue: string) => {
				if (this.autocompleteOptions().length > 0) {
					const toFilter = JSON.parse(JSON.stringify(this.autocompleteOptions()));
					return this.filterAutocomplete(searchValue || '', toFilter);
				}
				return [];
			})
		);
	}

	private filterAutocomplete(
		filterValue: string,
		optionsToFilter: (ObIAutocompleteInputOption<T> | ObIAutocompleteInputOptionGroup<T>)[]
	): (ObIAutocompleteInputOptionGroup<T> | ObIAutocompleteInputOption<T>)[] {
		this.hasGroupOptions = this.isGroupOption(optionsToFilter[0]);
		const searchText = filterValue.toLowerCase();
		if (this.autocompleteInputControl.value === '') {
			return this.autocompleteOptions();
		}
		return this.hasGroupOptions
			? this.filterGroups(optionsToFilter as ObIAutocompleteInputOptionGroup<T>[], searchText)
			: this.filterOptions(optionsToFilter as ObIAutocompleteInputOption<T>[], searchText);
	}

	private filterGroups(
		groups: ObIAutocompleteInputOptionGroup<T>[],
		searchText: string
	): ObIAutocompleteInputOptionGroup<T>[] {
		return groups
			.map(group => ({...group, groupOptions: this.filterOptions(group.groupOptions, searchText)}))
			.filter(group => group.groupOptions.length > 0);
	}

	private filterOptions(options: ObIAutocompleteInputOption<T>[], searchText: string): ObIAutocompleteInputOption<T>[] {
		const escapedSearchText = this.obAutocompleteTextToFindService.escapeRegexCharacter(searchText);
		return options.filter((option: ObIAutocompleteInputOption<T>) =>
			new RegExp(escapedSearchText, this.filterRegexFlag()).test(this.getStringValue(option.label))
		);
	}

	private isGroupOption(option: ObIAutocompleteInputOptionGroup<T> | ObIAutocompleteInputOption<T>): boolean {
		return !!(option as ObIAutocompleteInputOptionGroup).groupOptions;
	}
}
