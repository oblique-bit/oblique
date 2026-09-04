import {Directive, ElementRef, computed, effect, inject, input, model} from '@angular/core';
import {ObSelectableGroupDirective} from './selectable-group.directive';

@Directive({
	selector: '[obSelectable]',
	host: {
		'(click)': 'onClick($event)',
		'(focus)': 'onFocus()',
		'(keydown.control.space)': 'onClick($event)',
		'(keydown.shift.space)': 'onClick($event)',
		'(keydown.space)': 'onClick($event)',
		'[attr.aria-checked]': 'selected()',
		'[attr.role]': 'role()',
		'[attr.tabindex]': 'tabindex()',
		'[class.ob-selectable]': 'selectable',
		'[class.ob-selected]': 'selected()',
		class: 'ob-selectable',
	},
	exportAs: 'obSelectable',
})
export class ObSelectableDirective<T = any> {
	readonly value = input<T>();
	readonly selected = model(false);
	readonly selectable = true;
	readonly tabindex = model(0);

	readonly role = computed(() => {
		const mode = this.group.effectiveMode();
		return mode === 'windows' ? undefined : mode;
	});

	private disabled = false;
	private readonly initialTabindex: number;
	private readonly element = inject(ElementRef);
	private readonly group = inject<ObSelectableGroupDirective<T>>(ObSelectableGroupDirective, {optional: true});

	constructor() {
		if (!this.group) {
			throw new Error(
				'ObSelectableDirective need to be wrapped in an ObSelectableGroupDirective. Please consult the documentation for more information'
			);
		}

		this.initialTabindex = this.tabindex();
		this.group.register(this);

		effect(() => {
			this.toggleDisabled(this.group.disabled());
		});
	}

	onClick($event: KeyboardEvent | MouseEvent): void {
		$event.preventDefault();
		if (!this.disabled) {
			this.group.toggle(this, $event.ctrlKey, $event.shiftKey);
		}
	}

	onFocus(): void {
		this.group.focus(this);
	}

	public focus(): void {
		this.element.nativeElement.focus();
	}

	private toggleDisabled(state: boolean): void {
		this.disabled = state;
		this.tabindex.set(state ? -1 : this.initialTabindex);
	}
}
