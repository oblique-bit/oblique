import {Directive, booleanAttribute, computed, input} from '@angular/core';

@Directive({
	selector: '[obDisableLink]',
	host: {
		'[attr.aria-disabled]': 'disabled()',
		'[attr.role]': 'role()',
		'[attr.href]': 'attributeHref()',
	},
})
export class ObDisableLinkDirective {
	readonly obDisableLink = input(true, {transform: booleanAttribute});
	readonly href = input<string>();

	protected readonly disabled = computed(() => (this.obDisableLink() ? 'true' : undefined));
	protected readonly role = computed(() => (this.obDisableLink() ? 'link' : undefined));
	protected readonly attributeHref = computed(() => (this.obDisableLink() ? undefined : this.href()));
}
