import {Directive, HostBinding, Input, OnChanges} from '@angular/core';

@Directive({
	standalone: true,
	selector: '[obDisableLink]'
})
export class ObDisableLinkDirective implements OnChanges {
	@Input() set obDisableLink(condition: boolean) {
		if (typeof condition === 'boolean') {
			this.condition = condition;
		}
	}
	@Input()
	href: string;

	@HostBinding('attr.aria-disabled')
	private disabled: string;
	@HostBinding('attr.role')
	private role: string;
	@HostBinding('attr.href')
	private attributeHref: string;

	private originalHref: string;
	private condition = true;

	ngOnChanges(): void {
		this.originalHref ??= this.href;

		if (this.condition) {
			this.disabled = 'true';
			this.role = 'link';
			this.attributeHref = undefined;
		} else {
			this.disabled = undefined;
			this.role = undefined;
			this.attributeHref = this.originalHref;
		}
	}
}
