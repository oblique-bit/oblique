/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Inspired from Simon Lindh:
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
import {MultiselectTexts} from './multiselect.texts';

const MULTISELECT_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => MultiselectComponent),
	multi: true
};

// See: https://github.com/angular/angular/issues/5145
let nextId = 0;

@Component({
	selector: 'or-multiselect',
	providers: [MULTISELECT_VALUE_ACCESSOR],
	styles: [
		`
			:host[readonly],
			:host.readonly {
				 border: none;
			}

			.multiselect-toggle {
				display: flex;
				background-color: #fff;
				border-radius: 0;
				text-align: left;
				white-space: normal;
				min-width: 100%;
			}

			.multiselect-toggle:disabled {
				color: black;
				opacity: 1;
				border: 1px solid #f4f4f4;
			}

			.multiselect-toggle .toggle {
				margin-left: auto;
			}

			.multiselect-toggle .toggle::before {
				min-width: 0;
				margin-left: 5px;
			}

			.dropdown-menu {
				overflow: auto !important;
				width: 100%;
			}

			.dropdown .dropdown-menu {
				 margin-top: 0;
				 border-top-right-radius: 0;
				 border-top-left-radius: 0;
				 border-top: none;
			 }

			.dropup .dropdown-menu {
				 margin-bottom: 0;
				 border-bottom-right-radius: 0;
				 border-bottom-left-radius: 0;
				 border-bottom: none;
			 }

			.multiselect-control {
				font-size: small;
			}

			.dropdown-item:active {
				color: #171717;
				background-color: #f7f7f9;
			}

			.checkbox label {
				margin-bottom: 0;
				white-space: normal;
			}

			button.dropdown-item {
				cursor: pointer;
			}
		`
	],
	template: `
	<div [ngClass]="{'dropdown': !dropup, 'dropup': dropup}">
		<button type="button" class="multiselect-toggle btn btn-default"
		        (click)="toggleDropdown()" [disabled]="disabled"
		        [ngClass]="{open: isVisible}">
			<span class="multiselect-label">{{ title | translate:titleTranslateParams }}</span>
		    <span class="toggle" [ngClass]="{'toggle-down-up': !dropup, 'toggle-up-down': dropup}"></span>
	    </button>
		<div *ngIf="isVisible" class="dropdown-menu" [class.pull-right]="pullRight" [class.dropdown-menu-right]="pullRight"
			[style.max-height]="maxHeight" style="display: block; height: auto; overflow-y: auto;"
			[attr.aria-hidden]="!isVisible">
			<div class="dropdown-item" *ngIf="enableSearch">
				<div class="input-group input-group-sm control-action" >
					<span class="input-group-addon" [attr.id]="id + '-search'" [attr.aria-label]="texts.searchPlaceholder | translate">
						<span class="fa fa-search"></span>
					</span>
					<input type="text" class="form-control" placeholder="{{ texts.searchPlaceholder | translate}}"
					       [attr.aria-describedby]="id + '-search'" [(ngModel)]="searchFilterText" [ngModelOptions]="{standalone: true}">
					<button class="control-action-trigger" (click)="clearSearch($event)">
						<span class="fa fa-times-circle"></span>
					</button>
				</div>
			</div>
			<div class="dropdown-divider divider" *ngIf="enableSearch"></div>
			<button class="dropdown-item multiselect-control multiselect-control-check" *ngIf="showCheckAll" (click)="checkAll()">
				<span style="width: 16px;" class="fa fa-check">
				</span>
				{{ texts.checkAll | translate }}
			</button>
			<button class="dropdown-item multiselect-control multiselect-control-uncheck" *ngIf="showUncheckAll" (click)="uncheckAll()">
				<span style="width: 16px;" class="fa fa-times">
				</span>
				{{ texts.uncheckAll | translate }}
			</button>
			<div *ngIf="showCheckAll || showUncheckAll" class="dropdown-divider divider"></div>
			<button class="dropdown-item" *ngFor="let option of options | searchFilter:searchFilterText; let i = index"
				(click)="toggleSelection(option)">
				<div class="checkbox">
					<input tabindex="-1" type="checkbox" id="{{id}}-{{i}}" [checked]="isSelected(option)" (click)="preventCheckboxCheck($event)">
					<label for="{{id}}-{{i}}">{{formatOptionForLabel(option)}}</label>
				</div>
			</button>
		</div>
    </div>
  `
})
export class MultiselectComponent implements OnInit, DoCheck, ControlValueAccessor {
	@Input() options: any[];
	@Input() texts: MultiselectTexts;
	@Input() dropup = false;
	@Input() disabled = false;
	@Input() labelProperty: string;
	@Input() labelFormatter: (option: any) => string;

	//Inputs that are initialized by the config
	@Input() enableAllSelectedText;
	@Input() dynamicTitleMaxItems;
	@Input() enableSearch;
	@Input() maxHeight;
	@Input() pullRight;
	@Input() selectionLimit;
	@Input() showCheckAll;
	@Input() showUncheckAll;

	@Output() selectionLimitReached = new EventEmitter<number>();
	@Output() dropdownClosed = new EventEmitter();
	@Output() onAdded = new EventEmitter<any>();
	@Output() onRemoved = new EventEmitter<any>();

	id = `ms-${nextId++}`;

	model: any[] = [];
	title: string;
	titleTranslateParams: any = {};
	differ: any;
	isVisible = false;
	searchFilterText = '';

	constructor(private element: ElementRef,
				private multiselectTexts: MultiselectTexts,
				multiselectConfig: MultiselectConfig,
				differs: IterableDiffers) {
		this.differ = differs.find([]).create(null);

		this.enableAllSelectedText = multiselectConfig.enableAllSelectedText;
		this.dynamicTitleMaxItems = multiselectConfig.dynamicTitleMaxItems;
		this.enableSearch = multiselectConfig.enableSearch;
		this.maxHeight = multiselectConfig.maxHeight;
		this.pullRight = multiselectConfig.pullRight;
		this.selectionLimit = multiselectConfig.selectionLimit;
		this.showCheckAll = multiselectConfig.showCheckAll;
		this.showUncheckAll = multiselectConfig.showUncheckAll;
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
		if ($event.keyCode === 27) {
			if (this.isVisible) {
				this.toggleDropdown();
			}
		}
	}

	ngOnInit() {
		this.texts = Object.assign({}, this.multiselectTexts, this.texts);
		this.title = this.texts.defaultTitle || '';
	}

	onModelChange: (_: any) => void = (_: any) => {
		//
	};

	onModelTouched: () => void = () => {
		//
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
