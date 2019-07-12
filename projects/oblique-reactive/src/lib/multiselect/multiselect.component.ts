/*
 * Angular Dropdown Multiselect for Bootstrap
 *
 * Inspired from Simon Lindh:
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
import {
	Component,
	DoCheck,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	IterableDiffers,
	OnInit,
	Output,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {FilterBoxComponent} from '../filter-box/filter-box.component';
import {MultiselectConfig} from './multiselect.config';
import {MultiselectTexts} from './multiselect.texts';
import {MaterialService} from '../material.service';

// See: https://github.com/angular/angular/issues/5145
let nextId = 0;

/**
 * @deprecated with material theme since version 4.0.0. Use angular material select instead
 */
@Component({
	selector: 'or-multiselect',
	exportAs: 'orMultiselect',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => MultiselectComponent),
		multi: true
	}],
	styleUrls: ['./multiselect.component.scss'],
	encapsulation: ViewEncapsulation.None,
	templateUrl: './multiselect.component.html'
})
export class MultiselectComponent implements OnInit, DoCheck, ControlValueAccessor {
	@Input() options: any[];
	@Input() texts: MultiselectTexts;
	@Input() dropup = false;
	@Input() disabled = false;
	@Input() labelProperty: string;
	@Input() labelFormatter: (option: any) => string;
	@Input() orId: string;

	//Inputs that are initialized by the config
	@Input() enableAllSelectedText;
	@Input() dynamicTitleMaxItems;
	@Input() enableSearch;
	@Input() maxHeight;
	@Input() selectionLimit;
	@Input() showCheckAll;
	@Input() showUncheckAll;

	@Output() selectionLimitReached = new EventEmitter<number>();
	@Output() dropdownClosed = new EventEmitter();
	@Output() onAdded = new EventEmitter<any>();
	@Output() onRemoved = new EventEmitter<any>();

	@ViewChild('orFilterBox', { static: false })
	filterBox: FilterBoxComponent;

	id = `or-multiselect-${nextId++}`;

	model: any[] = [];
	title: string;
	titleTranslateParams: any = {};
	differ: any;
	isVisible = false;
	searchFilterText = '';

	constructor(private readonly element: ElementRef,
				private readonly multiselectTexts: MultiselectTexts,
				materialService: MaterialService,
				multiselectConfig: MultiselectConfig,
				differs: IterableDiffers) {
		this.differ = differs.find([]).create(null);

		this.enableAllSelectedText = multiselectConfig.enableAllSelectedText;
		this.dynamicTitleMaxItems = multiselectConfig.dynamicTitleMaxItems;
		this.enableSearch = multiselectConfig.enableSearch;
		this.maxHeight = multiselectConfig.maxHeight;
		this.selectionLimit = multiselectConfig.selectionLimit;
		this.showCheckAll = multiselectConfig.showCheckAll;
		this.showUncheckAll = multiselectConfig.showUncheckAll;
		materialService.deprecated('datepicker');
	}

	//TODO: only apply this listener if the popup is open and remove it as soon as it's closed
	@HostListener('document:click', ['$event.target'])
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

	onModelChange: (_: any) => void = (_: any) => {
		//
	}
	onModelTouched: () => void = () => {
		//
	}

	ngOnInit() {
		this.texts = Object.assign({}, this.multiselectTexts, this.texts);
		this.title = this.texts.defaultTitle || '';
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
		} else if (this.enableSearch) {
			setTimeout(() => {
				// WAI-ARIA: describe inner filter box input:
				// TODO: create a ngAria-like directive
				this.filterBox.filterControl.nativeElement.setAttribute('aria-describedby', `${this.id}-search`);
			}, 0);
		}
	}

	isSelected(option): boolean {
		return this.model.indexOf(option) > -1;
	}

	toggleSelection(option) {
		const index = this.model.indexOf(option);

		if (index > -1) {
			this.model.splice(index, 1);
			this.onRemoved.emit(option);
			this.emitModelChange();
		} else if (!this.selectionLimit || (this.model.length < this.selectionLimit)) {
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
			this.title = this.model
				.map((option) => this.formatOptionForLabel(option))
				.join(', ');
		} else if (this.enableAllSelectedText && this.model.length === this.options.length) {
			this.title = this.texts.allSelected || '';
		} else {
			this.title = this.texts.checked;
			this.titleTranslateParams = {amount: this.model.length};
		}
	}

	checkAll() {
		this.model = this.options
			.map((option) => {
				if (this.model.indexOf(option) === -1) {
					this.onAdded.emit(option);
				}
				return option;
			});
		this.emitModelChange();
	}

	uncheckAll() {
		this.model.forEach((option) => this.onRemoved.emit(option));
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
		} else if (this.labelProperty) {
			return item[this.labelProperty];
		}
		return item;
	}

	private emitModelChange() {
		this.onModelChange(this.model);
		this.onModelTouched();
	}
}
