import {Directive, HostBinding, Input, OnChanges} from '@angular/core';

@Directive({
	selector: '[obDisableLink]',
	standalone: true,
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
	protected disabled: string;
	@HostBinding('attr.role')
	protected role: string;
	@HostBinding('attr.href')
	protected attributeHref: string;

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
