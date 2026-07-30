import {Directive, ElementRef, OnInit, computed, inject, input} from '@angular/core';
import {ObIconButtonDirective} from './icon-button.directive';
import {ObConsoleService} from '../console/ob-console.service';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

@Directive({
	selector: '[obButton]',
	host: {
		'[class.ob-button-primary]': 'primaryClass()',
		'[class.ob-button-secondary]': 'secondaryClass()',
		'[class.ob-button-tertiary]': 'tertiaryClass()',
		class: 'ob-button mat-primary',
	},
	hostDirectives: [ObIconButtonDirective],
	exportAs: 'obButton',
})
export class ObButtonDirective implements OnInit {
	readonly obButton = input<ButtonVariant>('primary', {
		transform: (value: string) => (value || 'primary') as ButtonVariant,
	});
	readonly primaryClass = computed(() => this.obButton() === 'primary');
	readonly secondaryClass = computed(() => this.obButton() === 'secondary');
	readonly tertiaryClass = computed(() => this.obButton() === 'tertiary');
	private static readonly forbidden = [
		'mat-raised-button',
		'mat-fab',
		'mat-mini-fab',
		'mat-stroked-button',
		'mat-flat-button',
	];
	private readonly element = inject(ElementRef);
	private readonly obConsole = inject(ObConsoleService);

	ngOnInit(): void {
		this.validateButtonVariant();
	}

	private validateButtonVariant(): void {
		const attribute = ObButtonDirective.forbidden.find(variant => this.element.nativeElement.hasAttribute(variant));
		if (attribute) {
			this.obConsole.error(
				'ObButtonDirective validateButtonVariant()',
				`The obButton directive is meant to be used with mat-button or mat-icon-button exclusively. An instance of ${attribute}, which can lead to unexpected effects, has been detected, please change it to one of the supported variant.`
			);
		}
	}
}
