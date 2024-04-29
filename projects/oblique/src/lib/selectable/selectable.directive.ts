import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DestroyRef, Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, inject} from '@angular/core';
import {ObSelectableGroupDirective} from './selectable-group.directive';

@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable',
	host: {class: 'ob-selectable'},
	standalone: true
})
export class ObSelectableDirective implements OnInit {
	@Input() value: any;
	@Input() @HostBinding('class.ob-selected') @HostBinding('attr.aria-checked') selected = false;
	@HostBinding('class.ob-selectable') readonly selectable = true;
	@Input() @HostBinding('attr.tabindex') tabindex = 0;
	@HostBinding('attr.role') role = 'checkbox';
	private readonly destroyRef = inject(DestroyRef);
	private disabled = false;
	private initialTabindex: number;

	constructor(
		private readonly element: ElementRef,
		@Optional() private readonly group: ObSelectableGroupDirective
	) {
		if (!group) {
			throw new Error(
				'The ObSelectableDirectives need to be wrapped in an ObSelectableGroupDirective. Please consult the documentation for more info'
			);
		}
	}

	ngOnInit(): void {
		this.initialTabindex = this.tabindex;
		this.group.register(this);
		this.group.mode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(mode => (this.role = mode === 'windows' ? undefined : mode));
		this.group.disabled$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(disabled => {
			this.toggleDisabled(disabled);
		});
	}

	@HostListener('click', ['$event'])
	@HostListener('keydown.space', ['$event'])
	@HostListener('keydown.shift.space', ['$event'])
	@HostListener('keydown.control.space', ['$event'])
	onClick($event: KeyboardEvent | MouseEvent): void {
		$event.preventDefault();
		if (!this.disabled) {
			this.group.toggle(this, $event.ctrlKey, $event.shiftKey);
		}
	}

	@HostListener('focus')
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
