import {AfterContentInit, Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {ObSelectableDirective} from './selectable.directive';

@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup',
	host: {class: 'ob-selectable-group'},
	standalone: true
})
export class ObSelectableGroupDirective implements AfterContentInit {
	@HostBinding('attr.role') role = 'group';
	@HostBinding('class.ob-selectable-group') readonly selectable = true;
	@Output() readonly selected$ = new EventEmitter<ObSelectableDirective[]>();
	@Output() readonly mode$ = new EventEmitter<'checkbox' | 'radio' | 'windows'>();
	private readonly selectables: ObSelectableDirective[] = [];
	private modeValue: 'checkbox' | 'radio' | 'windows' = 'checkbox';
	private focused: number;
	private prevFocused: number;
	private startFocused: number;
	private readonly window: Window;
	private readonly modeToggle = {
		checkbox: this.checkboxSelect.bind(this),
		radio: this.radioSelect.bind(this),
		windows: this.windowsSelect.bind(this)
	};

	constructor() {
		this.window = window; // because AoT don't accept interfaces as DI
		this.mode$.subscribe(mode => {
			this.role = mode === 'radio' ? 'radiogroup' : 'group';
			if (mode === 'radio') {
				this.getSelected()
					.slice(1)
					.forEach(item => (item.selected = false));
				this.updateSelection();
			}
		});
		this.updateSelection();
	}

	ngAfterContentInit(): void {
		// because we don't want every consumer to pipe defer to avoid an ExpressionChangedAfterItHasBeenCheckedError
		this.window.setTimeout(() => this.updateSelection());
	}

	get mode(): 'checkbox' | 'radio' | 'windows' {
		return this.modeValue;
	}

	@Input() set mode(mode: 'checkbox' | 'radio' | 'windows') {
		this.modeValue = mode || 'checkbox';
		this.mode$.emit(this.modeValue);
	}

	register(directive: ObSelectableDirective): void {
		this.selectables.push(directive);
	}

	toggle(directive: ObSelectableDirective, ctrl = false, shift = false): void {
		this.modeToggle[this.mode](directive, ctrl, shift);
		this.updateSelection();
	}

	focus(directive: ObSelectableDirective): void {
		this.prevFocused = this.focused;
		this.focused = this.selectables.findIndex(item => item === directive);
	}

	selectAll(): void {
		if (this.mode !== 'radio') {
			this.selectables.forEach(item => (item.selected = true));
			this.updateSelection();
		}
	}

	deselectAll(): void {
		if (this.mode !== 'radio') {
			this.selectables.forEach(item => (item.selected = false));
			this.updateSelection();
		}
	}

	sort(sortFunction: (a: ObSelectableDirective, b: ObSelectableDirective) => number): void {
		this.selectables.sort(sortFunction);
	}

	@HostListener('keydown.arrowDown', ['$event'])
	@HostListener('keydown.arrowRight', ['$event'])
	onArrowDown($event: KeyboardEvent): void {
		this.next(1, $event);
	}

	@HostListener('keydown.arrowUp', ['$event'])
	@HostListener('keydown.arrowLeft', ['$event'])
	onArrowUp($event: KeyboardEvent): void {
		this.next(-1, $event);
	}

	@HostListener('keydown.shift.arrowDown', ['$event'])
	@HostListener('keydown.shift.arrowRight', ['$event'])
	onShiftArrowDown($event: KeyboardEvent): void {
		this.add(+1, $event);
	}

	@HostListener('keydown.shift.arrowUp', ['$event'])
	@HostListener('keydown.shift.arrowLeft', ['$event'])
	onShiftArrowUp($event: KeyboardEvent): void {
		this.add(-1, $event);
	}

	@HostListener('keydown.control.arrowDown', ['$event'])
	@HostListener('keydown.control.arrowRight', ['$event'])
	onCtrlArrowDown($event: KeyboardEvent): void {
		this.move(+1, $event);
	}

	@HostListener('keydown.control.arrowUp', ['$event'])
	@HostListener('keydown.control.arrowLeft', ['$event'])
	onCtrlArrowUp($event: KeyboardEvent): void {
		this.move(-1, $event);
	}

	private add(direction: number, $event: KeyboardEvent): void {
		if (this.mode === 'windows') {
			$event.preventDefault();
			const index = this.focused + direction;
			if (index > -1 && index < this.selectables.length) {
				if (this.selectables[index].selected) {
					this.selectables[this.focused].selected = false;
				} else {
					this.selectables[index].selected = true;
				}
				this.selectables[index].focus();
				this.updateSelection();
			}
		}
	}

	private move(direction: number, $event: KeyboardEvent): void {
		if (this.mode === 'windows') {
			$event.preventDefault();
			const index = this.focused + direction;
			if (index > -1 && index < this.selectables.length) {
				this.selectables[index].focus();
			}
		}
	}

	private next(direction: number, $event: KeyboardEvent): void {
		if (this.mode !== 'checkbox') {
			$event.preventDefault();
			const index =
				this.mode === 'radio'
					? (this.focused + this.selectables.length + direction) % this.selectables.length
					: Math.max(0, Math.min(this.selectables.length - 1, this.focused + direction));
			this.toggle(this.selectables[index]);
			this.selectables[index].focus();
			this.updateSelection();
		}
	}

	private checkboxSelect(directive: ObSelectableDirective): void {
		directive.selected = !directive.selected;
	}

	private radioSelect(directive: ObSelectableDirective): void {
		this.selectables.forEach(item => (item.selected = false));
		directive.selected = true;
	}

	private windowsSelect(directive: ObSelectableDirective, ctrl = false, shift = false): void {
		if (ctrl) {
			this.startFocused = undefined;
			if (this.getSelected().length > 1 || !directive.selected) {
				directive.selected = !directive.selected;
			}
		} else if (shift) {
			/* eslint-disable logical-assignment-operators */
			this.startFocused = this.startFocused ?? this.prevFocused;
			const endFocused = this.selectables.findIndex(item => item === directive);
			const start = Math.min(this.startFocused, endFocused);
			const end = Math.max(this.startFocused, endFocused);
			this.selectables.forEach((item, index) => (item.selected = !(index < start || index > end)));
		} else {
			this.startFocused = undefined;
			this.selectables.forEach(item => (item.selected = false));
			directive.selected = true;
		}
	}

	private updateSelection(): void {
		this.selected$.emit(this.getSelected());
	}

	private getSelected(): ObSelectableDirective[] {
		return this.selectables.filter(item => item.selected);
	}
}
