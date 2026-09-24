import {LitElement, type TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import getStyles from '../../utils/get-styles';
import headingStyles from '../css/layers/text/heading.css?inline';
import componentStyles from './ob-demo.css?inline';
@customElement('ob-demo')
export class ObDemo extends LitElement {
	static override styles = getStyles(headingStyles, componentStyles);
	@property({type: String})
	override title = 'No Title';
	@property({type: Boolean})
	open = false;
	override render(): TemplateResult {
		return html`
			<section>
				<h1 @click=${() => this.toggle()}>${this.title}</h1>
				${when(
					this.open,
					() =>
						html`<div>
							<slot></slot>
						</div>`
				)}
			</section>
		`;
	}
	private toggle(): void {
		this.open = !this.open;
	}
}
