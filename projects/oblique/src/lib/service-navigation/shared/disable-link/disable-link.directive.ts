import {Directive, Input, OnChanges} from '@angular/core';

@Directive({
	selector: '[obDisableLink]',
	standalone: true,
	host: {
		'[attr.aria-disabled]': 'disabled',
		'[attr.role]': 'role',
		'[attr.href]': 'attributeHref',
	},
})
export class ObDisableLinkDirective implements OnChanges {
	@Input() set obDisableLink(condition: boolean) {
		if (typeof condition === 'boolean') {
			this.condition = condition;
		}
	}
	@Input()
	href: string;

	protected disabled: string;
	protected role: string;
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
