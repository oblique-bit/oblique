import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DestroyRef, Directive, ElementRef, Input, OnInit, Optional, inject} from '@angular/core';
import {ObSelectableGroupDirective} from './selectable-group.directive';
import {startWith} from 'rxjs';

@Directive({
	selector: '[obSelectable]',
	standalone: true,
	host: {
		'(click)': 'onClick($event)',
		'(focus)': 'onFocus()',
		'(keydown.control.space)': 'onClick($event)',
		'(keydown.shift.space)': 'onClick($event)',
		'(keydown.space)': 'onClick($event)',
		'[attr.aria-checked]': 'selected',
		'[attr.role]': 'role',
		'[attr.tabindex]': 'tabindex',
		'[class.ob-selectable]': 'selectable',
		'[class.ob-selected]': 'selected',
		class: 'ob-selectable',
	},
	exportAs: 'obSelectable',
})
export class ObSelectableDirective<T = any> implements OnInit {
	@Input() value: T;
	@Input() selected = false;
	readonly selectable = true;
	@Input() tabindex = 0;
	role = 'checkbox';
	private readonly destroyRef = inject(DestroyRef);
	private disabled = false;
	private initialTabindex: number;

	constructor(
		private readonly element: ElementRef,
		@Optional() private readonly group: ObSelectableGroupDirective<T>
	) {
		if (!group) {
			throw new Error(
				'ObSelectableDirective need to be wrapped in an ObSelectableGroupDirective. Please consult the documentation for more information'
			);
		}
	}

	ngOnInit(): void {
		this.initialTabindex = this.tabindex;
		this.group.register(this);
		this.group.mode$.pipe(startWith(this.group.mode), takeUntilDestroyed(this.destroyRef)).subscribe(mode => {
			this.role = mode === 'windows' ? undefined : mode;
		});
		this.group.disabled$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(disabled => {
			this.toggleDisabled(disabled);
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
		this.tabindex = state ? -1 : this.initialTabindex;
	}
}
