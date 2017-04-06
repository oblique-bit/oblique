/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */

import {
	Component,
	OnInit,
	DoCheck,
	HostListener,
	Input,
	ElementRef,
	Output,
	EventEmitter,
	forwardRef,
	IterableDiffers
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {MultiselectConfig} from './multiselect.config';

const MULTISELECT_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => MultiselectComponent),
	multi: true
};

export interface IMultiSelectTexts {
	checkAll?: string;
	uncheckAll?: string;
	checked?: string;
	checkedPlural?: string;
	searchPlaceholder?: string;
	defaultTitle?: string;
	allSelected?: string;
}


@Component({
	selector: 'multiselect',
	providers: [MULTISELECT_VALUE_ACCESSOR],
	styles: [
		`
			.dropdown-toggle {
			    position: relative;
    			background-color: #fff;
    			padding-right: 30px;
    			border-radius: 0;
    			text-align: left;
    			white-space: normal;
    			min-width: 100%;
    		}
    		
    		.dropdown-toggle::after {
    			    position: absolute;
    				right: 10px;
    		}
    		
    		.checkbox label {
    			margin-bottom: 0;
    		}
    		
    		button.dropdown-item {
    			cursor: pointer; 
    		}
		`
	],
	template: `
    <div class="dropdown">
        <button type="button" class="dropdown-toggle btn btn-default" 
                (click)="toggleDropdown()" [disabled]="disabled">
                {{ title }}
		</button>
		<div *ngIf="isVisible" class="dropdown-menu" [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight"
			[style.max-height]="settings.maxHeight" style="display: block; height: auto; overflow-y: auto;">
			<div class="dropdown-item" *ngIf="settings.enableSearch">
				<div class="input-group input-group-sm control-action" >
					<span class="input-group-addon" id="sizing-addon3"><i class="fa fa-search"></i></span>
					<input type="text" class="form-control" placeholder="{{ texts.searchPlaceholder }}"
							aria-describedby="sizing-addon3" [(ngModel)]="searchFilterText" [ngModelOptions]="{standalone: true}">
					<button class="control-action-trigger" (click)="clearSearch($event)">
						<span class="fa fa-times-circle"></span>
					</button>
				</div>
			</div>
			<div class="dropdown-divider divider" *ngIf="settings.enableSearch"></div>
			<button class="dropdown-item check-control check-control-check" *ngIf="settings.showCheckAll" (click)="checkAll()">
				<span style="width: 16px;" class="fa fa-check">
				</span>
				{{ texts.checkAll }}
			</button>
			<button class="dropdown-item check-control check-control-uncheck" *ngIf="settings.showUncheckAll" (click)="uncheckAll()">
				<span style="width: 16px;" class="fa fa-times">
				</span>
				{{ texts.uncheckAll }}
			</button>
			<div *ngIf="settings.showCheckAll || settings.showUncheckAll" class="dropdown-divider divider"></div>
			<button class="dropdown-item" *ngFor="let option of options | searchFilter:searchFilterText"
				(click)="toggleSelection($event, option)">
				<div *ngIf="settings.checkedStyle === 'checkboxes'" class="checkbox">
					<!-- TODO how should the id's be generated?-->
					<input tabindex="-1" type="checkbox" id="dropdown-multiselect-{{formatOptionForLabel(option)}}" [checked]="isSelected(option)" (click)="preventCheckboxCheck($event)"> 
					<label for="dropdown-multiselect-{{formatOptionForLabel(option)}}">{{formatOptionForLabel(option)}}</label>
				</div>
				<span *ngIf="settings.checkedStyle === 'fontawesome'" style="width: 16px;display: inline-block;">
					<i *ngIf="isSelected(option)" class="fa fa-check" aria-hidden="true"></i>
				</span>
				<span *ngIf="settings.checkedStyle === 'fontawesome'" [ngClass]="settings.itemClasses">
					{{ formatOptionForLabel(option)}}
				</span>
			</button>
		</div>
    </div>
  `
})
export class MultiselectComponent implements OnInit, DoCheck, ControlValueAccessor {
	@Input() options: any[];
	@Input() settings: MultiselectConfig;
	@Input() texts: IMultiSelectTexts;
	@Input() disabled: boolean = false;
	@Input() labelFormatter: (option: any) => string;
	@Output() selectionLimitReached = new EventEmitter();
	@Output() dropdownClosed = new EventEmitter();
	@Output() onAdded = new EventEmitter();
	@Output() onRemoved = new EventEmitter();

	model: any[] = [];
	title: string;
	differ: any;
	isVisible: boolean = false;
	searchFilterText: string = '';

	//TODO: extract this!
	defaultTexts: IMultiSelectTexts = {
		checkAll: 'Check all',
		uncheckAll: 'Uncheck all',
		checked: 'checked',
		checkedPlural: 'checked',
		searchPlaceholder: 'Search...',
		defaultTitle: 'Select',
		allSelected: 'All selected',
	};

	constructor(private element: ElementRef,
				private multiselectDropdownConfig: MultiselectConfig,
				differs: IterableDiffers) {
		this.differ = differs.find([]).create(null);
	}

	@HostListener('document: click', ['$event.target'])
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

	ngOnInit() {
		this.settings = Object.assign(this.multiselectDropdownConfig, this.settings);
		this.texts = Object.assign(this.defaultTexts, this.texts);
		this.title = this.texts.defaultTitle || '';
	}

	onModelChange: (_: any) => void = (_: any) => {
	};
	onModelTouched: () => void = () => {
	};

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

	setDisabledState(isDisabled: boolean) {
		this.disabled = isDisabled;
	}

	ngDoCheck() {
		const changes = this.differ.diff(this.model);
		if (changes) {
			this.updateTitle();
		}
	}

	clearSearch(event: Event) {
		event.stopPropagation();
		this.searchFilterText = '';
	}

	toggleDropdown() {
		this.isVisible = !this.isVisible;
		if (!this.isVisible) {
			this.dropdownClosed.emit();
		}
	}

	isSelected(option): boolean {
		return this.model && this.model.indexOf(option) > -1;
	}

	toggleSelection(event: Event, option) {
		if (!this.model) {
			this.model = [];
		}
		const index = this.model.indexOf(option);

		if (index > -1) {
			this.model.splice(index, 1);
			this.onRemoved.emit(option);
			this.emitModelChange()
		} else if (!this.settings.selectionLimit || (this.model.length < this.settings.selectionLimit)) {
			this.model.push(option);
			this.onAdded.emit(option);
			this.emitModelChange()
		} else {
			//TODO: what to do here?
			this.selectionLimitReached.emit(this.model.length);
			return;
		}
	}

	updateTitle() {
		if (this.model.length === 0) {
			this.title = this.texts.defaultTitle || '';

			//TODO
			/*} else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
			 this.title = this.options
			 .filter((option) =>
			 this.model && this.model.indexOf(option.id) > -1
			 )
			 .map((option) => option.name)
			 .join(', ');*/
		} else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
			this.title = this.texts.allSelected || '';
		} else {
			this.title = this.model.length
				+ ' '
				+ (this.model.length === 1 ? this.texts.checked : this.texts.checkedPlural);
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
		this.emitModelChange()
	}

	uncheckAll() {
		this.model.forEach((id: number) => this.onRemoved.emit(id));
		this.model = [];
		this.emitModelChange();
	}

	preventCheckboxCheck(event: Event) {
		event.stopPropagation();
		event.preventDefault();
	}

	formatOptionForLabel(item: any): string {
		return item && this.labelFormatter ? this.labelFormatter(item) : item;
	}

	private emitModelChange() {
		this.onModelChange(this.model);
		this.onModelTouched();
	}
}
