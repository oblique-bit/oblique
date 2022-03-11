import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Optional} from '@angular/core';
import {ObSelectableGroupDirective} from './selectable-group.directive';

@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable',
	host: {class: 'ob-selectable'}
})
export class ObSelectableDirective implements OnInit {
	@Input() value: any;
	@Input() @HostBinding('class.ob-selected') @HostBinding('attr.aria-checked') selected = false;
	@HostBinding('class.ob-selectable') readonly selectable = true;
	@Input() @HostBinding('attr.tabindex') tabindex = 0;
	@HostBinding('style.cursor') readonly cursor = 'pointer';
	@HostBinding('attr.role') role = 'checkbox';

	constructor(private readonly element: ElementRef, @Optional() private readonly group: ObSelectableGroupDirective) {
		if (!group) {
			throw new Error(
				'The ObSelectableDirectives need to be wrapped in an ObSelectableGroupDirective. Please consult the documentation for more info'
			);
		}
	}

	ngOnInit(): void {
		this.group.register(this);
		this.group.mode$.subscribe(mode => (this.role = mode === 'windows' ? undefined : mode));
	}

	@HostListener('click', ['$event'])
	@HostListener('keydown.space', ['$event'])
	@HostListener('keydown.shift.space', ['$event'])
	@HostListener('keydown.control.space', ['$event'])
	onClick($event: KeyboardEvent | MouseEvent): void {
		$event.preventDefault();
		this.group.toggle(this, $event.ctrlKey, $event.shiftKey);
	}

	@HostListener('focus')
	onFocus(): void {
		this.group.focus(this);
	}

	public focus(): void {
		this.element.nativeElement.focus();
	}
}
