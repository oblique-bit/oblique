import {AsyncPipe, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {Observable, Subject, debounceTime} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup, OptionLabelIconPosition} from '../autocomplete/autocomplete.model';
import {ObInputClearDirective} from '../input-clear/input-clear.directive';
import {ObHighlightTextPipe} from './highlight-text/highlight-text.pipe';
import {ObOptionLabelIconDirective} from './option-label-icon/option-label-icon.directive';

@Component({
	selector: 'ob-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	host: {class: 'ob-autocomplete'},
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ObAutocompleteComponent,
			multi: true
		}
	],
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatIconModule,
		NgIf,
		MatInputModule,
		FormsModule,
		MatAutocompleteModule,
		ReactiveFormsModule,
		ObInputClearDirective,
		NgTemplateOutlet,
		NgFor,
		MatOptionModule,
		ObOptionLabelIconDirective,
		AsyncPipe,
		ObHighlightTextPipe,
		TranslateModule
	]
})
export class ObAutocompleteComponent implements OnChanges, ControlValueAccessor, OnDestroy {
	@Input() inputLabelKey = 'i18n.oblique.search.title';
	@Input() noResultKey = 'i18n.oblique.search.no-results';
	@Input() autocompleteOptions: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[] = [];

	/**
	 * @deprecated since version 10.3.0. It will be removed with Oblique 11 with no replacement
	 */
	@Input() filterRegexPattern = 'textToFind';
	@Input() filterRegexFlag = 'gi';
	@Input() highlightCssClass = 'ob-highlight-text';
	@Input() optionIconPosition: OptionLabelIconPosition = 'end';

	@Output() readonly selectedOptionChange: EventEmitter<ObIAutocompleteInputOption> = new EventEmitter<ObIAutocompleteInputOption>();
	autocompleteInputControl = new FormControl('', {updateOn: 'change'});
	filteredOptions$: Observable<(ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[]>;
	hasGroupOptions = false;
	private readonly unsubscribe = new Subject<void>();

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngOnChanges(): void {
		this.setupOptionsFilter();
	}

	setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.autocompleteInputControl.disable({emitEvent: false});
		} else {
			this.autocompleteInputControl.enable({emitEvent: false});
		}
	}

	/**
	 * @remarks
	 * This method must be overwritten by ControlValueAccessor, this is why an error is thrown by default.
	 */
	onModelTouched: () => void = () => {
		throw Error('Method onModelTouched has not been overwritten by the ControlValueAccessor.');
	};

	/**
	 * Write a new value to the element.
	 */
	writeValue(value: string): void {
		this.autocompleteInputControl.setValue(value, {emitEvent: false});
	}

	/**
	 * Set the function to be called
	 * when the control receives a change event.
	 */
	registerOnChange(fn: (v: any) => void): void {
		this.autocompleteInputControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(value => fn(value));
	}

	/**
	 * Set the function to be called
	 * when the control receives a touch event.
	 */
	registerOnTouched(fn: () => unknown): void {
		this.onModelTouched = fn;
		this.autocompleteInputControl.valueChanges
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => this.autocompleteInputControl.markAllAsTouched());
	}

	private setupOptionsFilter(): void {
		this.filteredOptions$ = this.autocompleteInputControl.valueChanges.pipe(
			startWith(''),
			debounceTime(200),
			map((searchValue: string) => {
				if (this.autocompleteOptions.length > 0) {
					const toFilter = JSON.parse(JSON.stringify(this.autocompleteOptions));
					return this.filterAutocomplete(searchValue || '', toFilter);
				}
				return [];
			})
		);
	}

	private filterAutocomplete(
		filterValue: string,
		optionsToFilter: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[]
	): (ObIAutocompleteInputOptionGroup | ObIAutocompleteInputOption)[] {
		this.hasGroupOptions = this.isGroupOption(optionsToFilter[0]);
		const searchText = filterValue.toLowerCase();
		if (this.autocompleteInputControl.value === '') {
			return this.autocompleteOptions;
		}
		return this.hasGroupOptions
			? this.filterGroups(optionsToFilter as ObIAutocompleteInputOptionGroup[], searchText)
			: this.filterOptions(optionsToFilter as ObIAutocompleteInputOption[], searchText);
	}

	private filterGroups(groups: ObIAutocompleteInputOptionGroup[], searchText: string): ObIAutocompleteInputOptionGroup[] {
		return groups
			.map(group => ({...group, groupOptions: this.filterOptions(group.groupOptions, searchText)}))
			.filter(group => group.groupOptions.length > 0);
	}

	private filterOptions(options: ObIAutocompleteInputOption[], searchText: string): ObIAutocompleteInputOption[] {
		const regex = new RegExp(searchText, this.filterRegexFlag);
		return options.filter((option: ObIAutocompleteInputOption) => regex.test(option.label));
	}

	private isGroupOption(option: ObIAutocompleteInputOptionGroup | ObIAutocompleteInputOption): boolean {
		return !!(option as ObIAutocompleteInputOptionGroup).groupOptions;
	}
}
