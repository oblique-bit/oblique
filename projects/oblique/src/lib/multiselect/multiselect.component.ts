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
	HostBinding,
	HostListener,
	Input,
	IterableDiffers,
	OnInit,
	Output,
	ViewChild,
	ViewEncapsulation,
	OnDestroy
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {ObFilterBoxComponent} from '../filter-box/filter-box.component';
import {ObMultiselectConfig} from './multiselect.config';
import {ObMultiselectTexts} from './multiselect.texts';
import {ObThemeService} from '../theme/theme.service';

/**
 * @deprecated with material theme since version 4.0.0. Use angular material select instead
 */
@Component({
	selector: 'ob-multiselect',
	exportAs: 'obMultiselect',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ObMultiselectComponent),
			multi: true
		}
	],
	styleUrls: ['./multiselect.component.scss'],
	encapsulation: ViewEncapsulation.None,
	templateUrl: './multiselect.component.html'
})
export class ObMultiselectComponent implements OnInit, OnDestroy, DoCheck, ControlValueAccessor {
	@Input() options: any[] = [];
	@Input() texts: ObMultiselectTexts;
	@Input() dropup = false;
	@Input() labelProperty: string;
	@Input() labelFormatter: (option: any) => string;
	@Input() titleProperty: string;
	@Input() titleFormatter: (option: any) => string;
	@Input() idPrefix = 'multiselect';
	@HostBinding('id') idContainer = `${this.idPrefix}-container`;

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

	@ViewChild('obFilterBox') filterBox: ObFilterBoxComponent;
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

	constructor(
		private readonly element: ElementRef,
		private readonly multiselectTexts: ObMultiselectTexts,
		private readonly multiselectConfig: ObMultiselectConfig,
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
	};
	onModelTouched: () => void = () => {
		//
	};

	ngOnInit() {
		this.texts = Object.assign({}, this.multiselectTexts, this.texts);
		this.title = this.texts.defaultTitle || '';
		this.multiselectConfig.isIdUnique(this.idPrefix);
	}

	ngOnDestroy() {
		this.multiselectConfig.clearId(this.idPrefix);
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
				this.filterBox.filterControl.nativeElement.setAttribute('aria-describedby', `${this.idPrefix}-search`);
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
			if (this.model.indexOf(option) === -1) {
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

	private emitModelChange() {
		this.onModelChange(this.model);
		this.onModelTouched();
	}
}
