import {LitElement, type TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';
import getStyles from '../../utils/get-styles';
import componentStyles from './ob-icon.css?inline';
import {iconsRegistry} from './ob-icons-registry';
import type {ObRegistrableIcon} from './ob-icon-model';

@customElement('ob-icon')
export class ObIcon extends LitElement {
	static override styles = getStyles(componentStyles);

	@property({type: String})
	key = '';

	@property({type: String})
	label = '';

	override render(): TemplateResult {
		const icon: ObRegistrableIcon | null = iconsRegistry.getIcon(this.key);

		if (icon === null) {
			console.warn(
				`No icon with key "${this.key}" was found in the icon registry. Nothing will be rendered. If you want to display the "${this.key}" icon, you need first to import and register it with "iconsRegistry.registerIcon(${this.key}Icon);"`
			);
		}

		return html`${when(
			icon !== null,
			() =>
				html`<svg
					id="${this.key}"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					role="${this.onlyIfSemanticIcon('img')}"
					aria-label="${this.onlyIfSemanticIcon(this.label)}"
					aria-hidden="${this.onlyIfNotSemanticIcon(true)}"
				>
					${unsafeSVG(icon?.svg)}
				</svg>`
		)}`;
	}

	private isSemanticIcon(): boolean {
		return this.label !== '';
	}

	/**
	 * This method is a helper that returns the value of `value` if the
	 * icon has a semantic meaning and `undefined` otherwise. It is used
	 * to conditionally adding/removing some HTML attributes such
	 * as `name` and `label` in combination with the Lit directive
	 * `isDefined`.
	 *
	 * @param value the value of the HTML attribute
	 * @returns `value` if the icon has a semantic meaning, undefined otherwise
	 */
	private onlyIfSemanticIcon(value: boolean | string): symbol | NonNullable<string | boolean> {
		return ifDefined(this.isSemanticIcon() ? value : undefined);
	}

	/**
	 * This method is a helper that returns the value of `value` if the
	 * icon has NOT a semantic meaning and `undefined` otherwise. It is used
	 * to conditionally adding/removing some HTML attributes such
	 * as `aria-hidden` and `focusable` in combination with the Lit directive
	 * `isDefined`.
	 *
	 * @param value the value of the HTML attribute
	 * @returns `value` if the icon has NOT a semantic meaning, undefined otherwise
	 */
	private onlyIfNotSemanticIcon(value: boolean | string): symbol | NonNullable<string | boolean> {
		return ifDefined(this.isSemanticIcon() ? undefined : value);
	}
}
