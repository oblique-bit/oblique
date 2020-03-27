import {AfterViewInit, ContentChildren, Directive, ElementRef, EventEmitter, Output, QueryList} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ObUnsubscribable} from '../../unsubscribe.class';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu'
})
export class ObMasterLayoutNavigationMenuDirective extends ObUnsubscribable implements AfterViewInit {
	@Output()
	onShow = new EventEmitter<boolean>();

	@ContentChildren(ObMasterLayoutNavigationMenuDirective, {descendants: true})
	$menus: QueryList<ObMasterLayoutNavigationMenuDirective>;

	constructor(private readonly element: ElementRef) {
		super();
	}

	ngAfterViewInit() {
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

	show() {
		this.onShow.next(true);
	}

	hide() {
		this.onShow.next(false);
	}
}
