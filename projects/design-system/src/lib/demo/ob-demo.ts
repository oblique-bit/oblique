import {LitElement, type TemplateResult, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

@customElement('ob-demo')
export class ObDemo extends LitElement {
	static override styles = css`
		section {
			border: 2px solid;
			border-radius: 0.5rem;
			padding: 1rem;
		}
	`;

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
