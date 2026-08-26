import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Signal,
	TemplateRef,
	WritableSignal,
	contentChild,
	contentChildren,
	input,
	model,
	output,
	signal,
	viewChild,
} from '@angular/core';
import {ObICollapseBreakpoints, ObIDynamicSkipLink, ObINavigationLink, ObISkipLink} from '../master-layout.model';
import {Params} from '@angular/router';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout',
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'obMasterLayout',
})
export class ObMockMasterLayoutComponent {
	readonly contentId = signal('content');
	readonly route: WritableSignal<{
		path: string | undefined;
		params: Params | undefined;
	}> = signal({path: '', params: undefined});
	readonly hasHighContrast = signal(false);
	readonly navigation = model<ObINavigationLink[]>([]);
	/** @deprecated since Oblique 16. Will be removed in Oblique 17. Use `navigationChange` instead. */
	readonly navigationChanged = output<ObINavigationLink[]>();
	readonly skipLinks = input<ObISkipLink[] | ObIDynamicSkipLink[]>([]);
	readonly collapseBreakpoint = input<ObICollapseBreakpoints>('md');
	readonly version = input<string>();
	readonly isLayoutCollapsed = signal(false);
	readonly isLayoutExpanded = signal(true);
	readonly isScrolling = signal(false);
	readonly prefersReducedMotion = signal(false);
	readonly obLogo = contentChild<TemplateRef<unknown>>('obHeaderLogo');
	readonly headerControlTemplates = contentChildren<TemplateRef<unknown>>('obHeaderControl');
	readonly headerMobileControlTemplates = contentChildren<TemplateRef<unknown>>('obHeaderMobileControl');
	readonly footerLinkTemplates = contentChildren<TemplateRef<HTMLLinkElement>>('obFooterLink');
	readonly offCanvasClose = viewChild('offCanvasClose', {read: ElementRef});
	readonly main = viewChild<ElementRef<HTMLElement>>('main');
	readonly wrapper = viewChild<ElementRef<HTMLElement>>('wrapper');
	readonly skipLinksInternal: Signal<
		{
			accessKey: number;
			label: string;
			url: string | 'current';
			fragment?: string;
		}[]
	> = signal([]);

	/** @deprecated since Oblique 16. Will be removed in Oblique 17.
	 *
	 * Use the `navigation` model with `[(navigation)]`
	 * or update it with `navigation.set(...)` instead.
	 */
	emitNavigation(navigation: ObINavigationLink[]): void {}

	scrollTop(element?: HTMLElement): void {}

	focusElementById(elementId: string): void {}
}
