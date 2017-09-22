import {AfterViewInit, ContentChildren, Directive, EventEmitter, HostBinding, Output, QueryList} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Directive({
	selector: '[orMasterLayoutNavigationMenu]',
	exportAs: 'orMasterLayoutNavigationMenu'
})
export class MasterLayoutNavigationMenuDirective implements AfterViewInit {

	@HostBinding('style')
	public style: any;

	@Output()
	onShow = new EventEmitter<boolean>();

	@ContentChildren(MasterLayoutNavigationMenuDirective, {descendants: true})
	$menus: QueryList<MasterLayoutNavigationMenuDirective>;

	constructor(private sanitizer: DomSanitizer) {
	}

	ngAfterViewInit() {
		this.$menus.forEach(($menu) => {
			if ($menu !== this) {
				$menu.onShow.subscribe((show) => {
					// <FIX> - for presentation only:
					// (cf. https://www.w3.org/Bugs/Public/show_bug.cgi?id=16328, https://bugs.chromium.org/p/chromium/issues/detail?id=20574):
					if (show) {
						$menu.style = null;
						this.style = this.sanitizer.bypassSecurityTrustStyle(
							'overflow: hidden; transform: initial; transition-duration: initial;'
						);
					} else {
						this.style = null;
						$menu.style = this.sanitizer.bypassSecurityTrustStyle('top: 0;');
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
