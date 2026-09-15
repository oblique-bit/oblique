import {NgTemplateOutlet} from '@angular/common';
import {
	AfterViewInit,
	Component,
	DestroyRef,
	DoCheck,
	ElementRef,
	Injector,
	Signal,
	ViewEncapsulation,
	booleanAttribute,
	computed,
	contentChildren,
	inject,
	input,
	output,
	viewChild,
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
import {MatOptionModule, MatOptionSelectionChange} from '@angular/material/core';
import {MatFormFieldModule, MatHint} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {debounceTime} from 'rxjs';
import {map} from 'rxjs/operators';
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
		ObHighlightTextPipe,
		TranslatePipe,
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
export class ObAutocompleteComponent<T = string> implements ControlValueAccessor, AfterViewInit, DoCheck {
	readonly withErrorMessages = input(false, {transform: booleanAttribute});
	readonly inputLabelKey = input('i18n.oblique.search.title');
	readonly noResultKey = input('i18n.oblique.search.no-results');
	readonly autocompleteOptions = input<(ObIAutocompleteInputOption<T> | ObIAutocompleteInputOptionGroup<T>)[]>([]);
	readonly filterRegexFlag = input('gi');
	readonly highlightCssClass = input('ob-highlight-text');
	readonly optionIconPosition = input<OptionLabelIconPosition>('end');
	readonly displayWith = input<(value: any) => string>(value => value);

	readonly selectedOptionChange = output<ObIAutocompleteInputOption<T>>();
	autocompleteInputControl = new FormControl<T | string>('', {updateOn: 'change'});
	filteredOptions = computed(() => {
		if (this.autocompleteOptions().length > 0) {
			return this.filterAutocomplete(this.searchText(), this.autocompleteOptions());
		}
		return [];
	});
	hasGroupOptions = computed(() => {
		if (!this.autocompleteOptions().length) {
			return false;
		}
		return this.isGroupOption(this.autocompleteOptions()[0]);
	});

	readonly searchText = toSignal(
		this.autocompleteInputControl.valueChanges.pipe(
			debounceTime(200),
			map(value => this.getStringValue(value))
		),
		{initialValue: ''}
	);

	readonly hints: Signal<{align: 'start' | 'end'; template: string}[]>;
	private readonly autocompleteTrigger = viewChild(MatAutocompleteTrigger);
	private readonly matHints = contentChildren(MatHint);
	private readonly matHintsElementRefs = contentChildren(MatHint, {read: ElementRef<HTMLElement>});
	private readonly destroyRef = inject(DestroyRef);
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

	ngDoCheck(): void {
		const trigger = this.autocompleteTrigger();
		if (!trigger?.panelOpen) {
			this.lastRect = undefined;
			return;
		}
		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		if (this.lastRect && (rect.top !== this.lastRect.top || rect.left !== this.lastRect.left)) {
			trigger.updatePosition();
		}
		this.lastRect = rect;
	}

	ngAfterViewInit(): void {
		if (this.withErrorMessages()) {
			const ngControl = this.injector.get(NgControl, null, {self: true, optional: true});
			if (ngControl?.control) {
				this.autocompleteInputControl.setValidators(ngControl.control.validator);
				// tell Angular that this control now has new validators
				this.autocompleteInputControl.updateValueAndValidity();
				// cancel dirty and touched states set by updateValueAndValidity
				this.autocompleteInputControl.markAsPristine();
				this.autocompleteInputControl.markAsUntouched();
			}
		}
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
	}

	/**
	 * Set the function to be called
	 * when the control receives a change event.
	 */
	registerOnChange(fn: (v: unknown) => void): void {
		this.autocompleteInputControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
			fn(value);
		});
	}

	/**
	 * Set the function to be called
	 * when the control receives a touch event.
	 */
	registerOnTouched(fn: () => void): void {
		this.onModelTouched = fn;
		this.autocompleteInputControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
			this.autocompleteInputControl.markAllAsTouched();
		});
	}

	onModelTouched: () => void = () => {
		// actual implementation is provided by registerOnTouched
	};

	protected selectionChange(option: ObIAutocompleteInputOption<T>, event: MatOptionSelectionChange): void {
		if (event.source.selected) {
			this.selectedOptionChange.emit(option);
		}
	}

	private getStringValue(value: T | string | null): string {
		if (value === null) {
			return '';
		}
		return typeof value === 'string' ? value : this.displayWith()(value);
	}

	private filterAutocomplete(
		filterValue: string,
		optionsToFilter: (ObIAutocompleteInputOption<T> | ObIAutocompleteInputOptionGroup<T>)[]
	): (ObIAutocompleteInputOptionGroup<T> | ObIAutocompleteInputOption<T>)[] {
		const searchText = filterValue.toLowerCase();
		if (this.autocompleteInputControl.value === '') {
			return this.autocompleteOptions();
		}
		return this.hasGroupOptions()
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
