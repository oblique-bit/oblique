import {ChangeDetectionStrategy, Component, Signal, TemplateRef, contentChildren, input, signal} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-footer',
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'obMasterLayoutFooter',
})
export class ObMockMasterLayoutFooterComponent {
	readonly templates = contentChildren<TemplateRef<HTMLLinkElement>>('obFooterLink');
	version = input<string>();
	isCustom: Signal<boolean> = signal(true);
}
