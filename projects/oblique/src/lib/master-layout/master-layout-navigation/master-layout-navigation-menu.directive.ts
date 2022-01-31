import {AfterViewInit, ContentChildren, Directive, ElementRef, EventEmitter, OnDestroy, Output, QueryList} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu',
	host: {class: 'ob-master-layout-navigation-menu'}
})
export class ObMasterLayoutNavigationMenuDirective implements AfterViewInit, OnDestroy {
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onShow = new EventEmitter<boolean>();

	@ContentChildren(ObMasterLayoutNavigationMenuDirective, {descendants: true})
	$menus: QueryList<ObMasterLayoutNavigationMenuDirective>;
	private readonly unsubscribe = new Subject();

	constructor(private readonly element: ElementRef) {}

	ngAfterViewInit(): void {
		this.$menus.forEach($menu => {
			if ($menu !== this) {
				$menu.onShow.pipe(takeUntil(this.unsubscribe)).subscribe(show => {
					// <FIX> - for presentation only:
					// (cf. https://www.w3.org/Bugs/Public/show_bug.cgi?id=16328, https://bugs.chromium.org/p/chromium/issues/detail?id=20574):
					if (show) {
						$menu.element.nativeElement.style.cssText = null;
						this.element.nativeElement.style.cssText = 'overflow: hidden; transform: initial; transition-duration: initial;';
					} else {
						this.element.nativeElement.style.cssText = null;
						$menu.element.nativeElement.style.cssText = 'top: 0;';
					}
					// </FIX>
				});
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	show(): void {
		this.onShow.next(true);
	}

	hide(): void {
		this.onShow.next(false);
	}
}
