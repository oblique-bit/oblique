/*
 * Angular Dropdown Multiselect for Bootstrap
 *
 * Inspired from Simon Lindh:
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
import {
	AfterViewInit,
	Component,
	DoCheck,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	IterableDiffers,
	OnDestroy,
	OnInit,
	Output,
	ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ObMultiselectConfig} from './multiselect.config';
import {ObMultiselectTexts} from './multiselect.texts';
import {ObThemeService} from '../theme.service';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {obOutsideFilter} from '../global-events/outsideFilter';

/**
 * @deprecated with material theme since version 4.0.0. Use angular material select instead.
 * Deprecated with bootstrap theme since version 8.0.0. Will be removed with version 10.0.0.
 */
@Component({
	selector: 'ob-multiselect',
	exportAs: 'obMultiselect',
	providers: [{provide: NG_VALUE_ACCESSOR, useExisting: ObMultiselectComponent, multi: true}],
	styleUrls: ['./multiselect.component.scss'],
	encapsulation: ViewEncapsulation.None,
	templateUrl: './multiselect.component.html',
	host: {class: 'ob-multiselect'}
})
export class ObMultiselectComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck, ControlValueAccessor {
	@Input() options: any[] = [];
	@Input() texts: ObMultiselectTexts;
	@Input() dropup = false;
	@Input() labelProperty: string;
	@Input() labelFormatter: (option: any) => string;
	@Input() titleProperty: string;
	@Input() titleFormatter: (option: any) => string;
	@Input() idPrefix = 'multiselect';
	@HostBinding('id') idContainer = `${this.idPrefix}-container`;

	// Inputs that are initialized by the config
	@Input() enableAllSelectedText;
	@Input() dynamicTitleMaxItems;
	@Input() enableSearch;
	@Input() maxHeight;
	@Input() selectionLimit;
	@Input() showCheckAll;
	@Input() showUncheckAll;

	@Output() readonly selectionLimitReached = new EventEmitter<number>();
	@Output() readonly dropdownClosed = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onAdded = new EventEmitter<any>();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onRemoved = new EventEmitter<any>();

	@HostBinding('attr.count') get count(): number {
		return this.options.length;
	}

	model: any[] = [];
	title: string;
	titleTranslateParams: any = {};
	differ: any;
	isVisible = false;
	searchFilterText = '';
	disabled = false;
	private readonly unsubscribe = new Subject();

	constructor(
		private readonly element: ElementRef,
		private readonly multiselectTexts: ObMultiselectTexts,
		private readonly multiselectConfig: ObMultiselectConfig,
		private readonly globalEventsService: ObGlobalEventsService,
		theme: ObThemeService,
		differs: IterableDiffers
	) {
		this.differ = differs.find([]).create(null);

		this.enableAllSelectedText = multiselectConfig.enableAllSelectedText;
		this.dynamicTitleMaxItems = multiselectConfig.dynamicTitleMaxItems;
		this.enableSearch = multiselectConfig.enableSearch;
		this.maxHeight = multiselectConfig.maxHeight;
		this.selectionLimit = multiselectConfig.selectionLimit;
		this.showCheckAll = multiselectConfig.showCheckAll;
		this.showUncheckAll = multiselectConfig.showUncheckAll;
		theme.deprecated('multiselect', 'select/overview#multiple-selection');
	}

	onClick(target: HTMLElement) {
		if (this.isVisible) {
			let parentFound = false;
			while (target != null && !parentFound) {
				if (target === this.element.nativeElement) {
					parentFound = true;
				}
				target = target.parentElement;
			}
			if (!parentFound) {
				this.isVisible = false;
				this.dropdownClosed.emit();
			}
		}
	}

	@HostListener('keyup', ['$event'])
	onKeyup($event: KeyboardEvent) {
		if ($event.code === 'ArrowUp' && this.isVisible) {
			this.toggleDropdown();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onModelChange: (_: any) => void = (_: any) => {
		//
	};
	onModelTouched: () => void = () => {
		//
	};

	ngOnInit() {
		this.texts = {...this.multiselectTexts, ...this.texts};
		this.title = this.texts.defaultTitle || '';
		this.multiselectConfig.isIdUnique(this.idPrefix);
	}

	ngAfterViewInit() {
		this.globalEventsService.click$
			.pipe(
				obOutsideFilter(this.element.nativeElement),
				filter(() => this.isVisible),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => this.onClick(event.target as HTMLElement));
	}

	ngOnDestroy() {
		this.multiselectConfig.clearId(this.idPrefix);
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	writeValue(value: any): void {
		if (value) {
			this.model = value;
		}
	}

	registerOnChange(fn: (_: any) => void): void {
		this.onModelChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onModelTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	ngDoCheck() {
		const changes = this.differ.diff(this.model);
		if (changes) {
			this.updateTitle();
		}
	}

	toggleDropdown() {
		this.isVisible = !this.isVisible;
		if (!this.isVisible) {
			this.dropdownClosed.emit();
		}
	}

	isSelected(option): boolean {
		return this.model.includes(option);
	}

	toggleSelection(option) {
		const index = this.model.indexOf(option);

		if (index > -1) {
			this.model.splice(index, 1);
			this.onRemoved.emit(option);
			this.emitModelChange();
		} else if (!this.selectionLimit || this.model.length < this.selectionLimit) {
			this.model.push(option);
			this.onAdded.emit(option);
			this.emitModelChange();
		} else {
			this.selectionLimitReached.emit(this.model.length);
		}
	}

	updateTitle() {
		if (this.model.length === 0) {
			this.title = this.texts.defaultTitle || '';
		} else if (this.dynamicTitleMaxItems && this.dynamicTitleMaxItems >= this.model.length) {
			this.title = '';
		} else if (this.enableAllSelectedText && this.model.length === this.options.length) {
			this.title = this.texts.allSelected || '';
		} else {
			this.title = this.texts.checked;
			this.titleTranslateParams = {amount: this.model.length};
		}
	}

	checkAll() {
		this.model = this.options.map(option => {
			if (!this.model.includes(option)) {
				this.onAdded.emit(option);
			}
			return option;
		});
		this.emitModelChange();
	}

	uncheckAll() {
		this.model.forEach(option => this.onRemoved.emit(option));
		this.model = [];
		this.emitModelChange();
	}

	preventCheckboxCheck(event: Event) {
		event.stopPropagation();
		event.preventDefault();
	}

	formatOptionForLabel(item: any): string {
		if (this.labelFormatter) {
			return this.labelFormatter(item);
		} else if (this.labelProperty && item[this.labelProperty]) {
			return item[this.labelProperty];
		}
		return item;
	}

	formatOptionForTitle(item: any): string {
		if (this.titleFormatter) {
			return this.titleFormatter(item);
		} else if (this.titleProperty && item[this.titleProperty]) {
			return item[this.titleProperty];
		}
		return this.formatOptionForLabel(item);
	}

	search(options: any[], searchString: string): any[] {
		searchString = searchString || '';
		return options.filter(option => this.formatOptionForLabel(option).toLowerCase().includes(searchString.toLowerCase()));
	}

	private emitModelChange() {
		this.onModelChange(this.model);
		this.onModelTouched();
	}
}
