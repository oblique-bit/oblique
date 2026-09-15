import {
	AfterContentInit,
	Directive,
	booleanAttribute,
	computed,
	effect,
	input,
	linkedSignal,
	model,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ObSelectableDirective} from './selectable.directive';

@Directive({
	selector: '[obSelectableGroup]',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: ObSelectableGroupDirective,
			multi: true,
		},
	],
	host: {
		'[attr.disabled]': 'effectiveDisabled() ? "" : null',
		'[attr.role]': 'role()',
		'(keydown.arrowDown)': 'onArrowDown($event)',
		'(keydown.arrowRight)': 'onArrowDown($event)',
		'(keydown.arrowUp)': 'onArrowUp($event)',
		'(keydown.arrowLeft)': 'onArrowUp($event)',
		'(keydown.shift.arrowDown)': 'onShiftArrowDown($event)',
		'(keydown.shift.arrowRight)': 'onShiftArrowDown($event)',
		'(keydown.shift.arrowUp)': 'onShiftArrowUp($event)',
		'(keydown.shift.arrowLeft)': 'onShiftArrowUp($event)',
		'(keydown.control.arrowDown)': 'onCtrlArrowDown($event)',
		'(keydown.control.arrowRight)': 'onCtrlArrowDown($event)',
		'(keydown.control.arrowUp)': 'onCtrlArrowUp($event)',
		'(keydown.control.arrowLeft)': 'onCtrlArrowUp($event)',
		'[class.ob-selectable-group]': 'selectable',
		class: 'ob-selectable-group',
	},
	exportAs: 'obSelectableGroup',
})
export class ObSelectableGroupDirective<T = any> implements AfterContentInit, ControlValueAccessor {
	readonly role = computed(() => (this.mode() === 'radio' ? 'radiogroup' : 'group'));
	readonly selectable = true;
	readonly selected = model<ObSelectableDirective<T>[]>([]);
	readonly mode = model<'checkbox' | 'radio' | 'windows'>('checkbox');
	readonly effectiveMode = computed(() => this.mode() ?? 'checkbox');

	readonly disabled = input(false, {transform: booleanAttribute});
	readonly effectiveDisabled = linkedSignal(() => this.disabled());

	private readonly selectables: ObSelectableDirective<T>[] = [];
	private focused = -1;
	private prevFocused = -1;
	private startFocused: number | undefined = undefined;
	private initialSelection: T[] = [];
	private readonly modeToggle = {
		checkbox: this.checkboxSelect.bind(this),
		radio: this.radioSelect.bind(this),
		windows: this.windowsSelect.bind(this),
	};

	constructor() {
		effect(() => {
			const mode = this.effectiveMode();
			if (mode === 'radio') {
				this.getSelected()
					.slice(1)
					.forEach(item => item.selected.set(false));

				this.updateSelection();
			}
		});
	}

	ngAfterContentInit(): void {
		this.updateSelection();
	}

	registerOnChange(fn: (value: T[]) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	writeValue(selection: T[]): void {
		this.initialSelection = selection ?? []; // because the first call to writeValue happens before register
		this.selectables.forEach(selectable => {
			selectable.selected.set(selection?.includes(selectable.value() as T) ?? false);
		});
	}

	setDisabledState(isDisabled: boolean): void {
		this.effectiveDisabled.set(isDisabled);
	}

	register(directive: ObSelectableDirective<T>): void {
		this.selectables.push(directive);
		// because writeValue have already been called once
		if (this.initialSelection.includes(directive.value() as T)) {
			directive.selected.set(true);
		}
	}

	toggle(directive: ObSelectableDirective<T>, ctrl = false, shift = false): void {
		this.modeToggle[this.effectiveMode()](directive, ctrl, shift);
		this.updateSelection();
		this.onTouched();
	}

	focus(directive: ObSelectableDirective<T>): void {
		this.prevFocused = this.focused;
		this.focused = this.selectables.findIndex(item => item === directive);
	}

	selectAll(): void {
		if (this.effectiveMode() !== 'radio') {
			this.selectables.forEach(item => {
				item.selected.set(true);
			});
			this.updateSelection();
		}
	}

	deselectAll(): void {
		if (this.effectiveMode() !== 'radio') {
			this.selectables.forEach(item => {
				item.selected.set(false);
			});
			this.updateSelection();
		}
	}

	sort(sortFunction: (a: ObSelectableDirective<T>, b: ObSelectableDirective<T>) => number): void {
		this.selectables.sort(sortFunction);
	}

	onArrowDown($event: KeyboardEvent): void {
		this.next(1, $event);
	}

	onArrowUp($event: KeyboardEvent): void {
		this.next(-1, $event);
	}

	onShiftArrowDown($event: KeyboardEvent): void {
		this.add(+1, $event);
	}

	onShiftArrowUp($event: KeyboardEvent): void {
		this.add(-1, $event);
	}

	onCtrlArrowDown($event: KeyboardEvent): void {
		this.move(+1, $event);
	}

	onCtrlArrowUp($event: KeyboardEvent): void {
		this.move(-1, $event);
	}

	private add(direction: number, $event: KeyboardEvent): void {
		if (this.effectiveMode() === 'windows') {
			$event.preventDefault();
			const index = this.focused + direction;
			if (index > -1 && index < this.selectables.length) {
				if (this.selectables[index].selected()) {
					this.selectables[this.focused].selected.set(false);
				} else {
					this.selectables[index].selected.set(true);
				}
				this.selectables[index].focus();
				this.updateSelection();
			}
		}
	}

	private move(direction: number, $event: KeyboardEvent): void {
		if (this.effectiveMode() === 'windows') {
			$event.preventDefault();
			const index = this.focused + direction;
			if (index > -1 && index < this.selectables.length) {
				this.selectables[index].focus();
			}
		}
	}

	private next(direction: number, $event: KeyboardEvent): void {
		if (this.effectiveMode() !== 'checkbox') {
			$event.preventDefault();
			const index =
				this.effectiveMode() === 'radio'
					? (this.focused + this.selectables.length + direction) % this.selectables.length
					: Math.max(0, Math.min(this.selectables.length - 1, this.focused + direction));
			this.toggle(this.selectables[index]);
			this.selectables[index].focus();
			this.updateSelection();
		}
	}

	private checkboxSelect(directive: ObSelectableDirective<T>): void {
		directive.selected.set(!directive.selected());
	}

	private radioSelect(directive: ObSelectableDirective<T>): void {
		this.selectables.forEach(item => {
			item.selected.set(false);
		});
		directive.selected.set(true);
	}

	private windowsSelect(directive: ObSelectableDirective<T>, ctrl: boolean, shift: boolean): void {
		if (ctrl) {
			this.startFocused = undefined;
			if (this.getSelected().length > 1 || !directive.selected()) {
				directive.selected.set(!directive.selected());
			}
		} else if (shift) {
			this.startFocused ??= this.prevFocused;
			const endFocused = this.selectables.findIndex(item => item === directive);
			const start = Math.min(this.startFocused, endFocused);
			const end = Math.max(this.startFocused, endFocused);
			this.selectables.forEach((item, index) => {
				item.selected.set(!(index < start || index > end));
			});
		} else {
			this.startFocused = undefined;
			this.selectables.forEach(item => {
				item.selected.set(false);
			});
			directive.selected.set(true);
		}
	}

	private updateSelection(): void {
		const selection = this.getSelected();
		this.selected.set(selection);
		this.onChange(selection.map(item => item.value() as T));
	}

	private getSelected(): ObSelectableDirective<T>[] {
		return this.selectables.filter(item => item.selected());
	}

	private onChange: (value: T[]) => void = () => {
		// in a form, this function will be overridden by the one provided by registerOnChange
		// outside a form, this function remains empty
		// this commend is necessary so that neither EsLint nor Sonar report an issue
	};
	private onTouched: () => void = () => {
		// in a form, this function will be overridden by the one provided by registerOnTouched
		// outside a form, this function remains empty
		// this commend is necessary so that neither EsLint nor Sonar report an issue
	};
}
