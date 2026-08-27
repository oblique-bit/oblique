import {type CSSResult, css, unsafeCSS} from 'lit';
import shadowReset from '../lib/css/layers/shadow-reset.css?inline';

export default function getStyles(...cssStyles: string[]): CSSResult[] {
	return [shadowReset, ...cssStyles].map(
		styles => css`
			${unsafeCSS(styles)}
		`
	);
}
