import {AsyncPipe, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewEncapsulation, inject} from '@angular/core';
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
import {ObAutocompleteTextToFindService} from './autocomplete-text-to-find.service';
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

	@Input() filterRegexFlag = 'gi';
	@Input() highlightCssClass = 'ob-highlight-text';
	@Input() optionIconPosition: OptionLabelIconPosition = 'end';

	@Output() readonly selectedOptionChange: EventEmitter<ObIAutocompleteInputOption> = new EventEmitter<ObIAutocompleteInputOption>();
	autocompleteInputControl = new FormControl('', {updateOn: 'change'});
	filteredOptions$: Observable<(ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[]>;
	hasGroupOptions = false;
	onModelTouched: () => void;
	private readonly unsubscribe = new Subject<void>();
	private readonly unsubscribeOptions = new Subject<void>();
	private readonly obAutocompleteTextToFindService = inject(ObAutocompleteTextToFindService);

	ngOnChanges(): void {
		this.setupOptionsFilter();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.unsubscribeOptions.next();
		this.unsubscribeOptions.complete();
	}

	setDisabledState(isDisabled: boolean): void {
		if (isDisabled) {
			this.autocompleteInputControl.disable({emitEvent: false});
		} else {
			this.autocompleteInputControl.enable({emitEvent: false});
		}
	}

	/**
	 * Write a new value to the element.
	 */
	writeValue(value: string): void {
		this.autocompleteInputControl.setValue(value, {emitEvent: false});
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
			takeUntil(this.unsubscribeOptions),
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
		const escapedSearchText = this.obAutocompleteTextToFindService.escapeRegexCharacter(searchText);
		return options.filter((option: ObIAutocompleteInputOption) => new RegExp(escapedSearchText, this.filterRegexFlag).test(option.label));
	}

	private isGroupOption(option: ObIAutocompleteInputOptionGroup | ObIAutocompleteInputOption): boolean {
		return !!(option as ObIAutocompleteInputOptionGroup).groupOptions;
	}
}
