import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ObExternalLinkDirective} from '@oblique/oblique';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
import type {UiUxData} from '../cms/models/tabbed-page.model';
import {RelatedLinkPipe} from './related-link.pipe';
import {latest} from '../../obliqueVersion';

@Component({
	selector: 'app-ui-ux',
	imports: [SafeHtmlPipe, RouterLink, RelatedLinkPipe, ObExternalLinkDirective],
	standalone: true,
	templateUrl: './ui-ux.component.html',
	styleUrl: './ui-ux.component.scss',
})
export class UiUxComponent {
	readonly currentObliqueVersion = Number(latest.split('.')[0]);
	readonly lastObliqueVersion = this.currentObliqueVersion - 1;
	readonly uiUx = input<UiUxData>(undefined);
}
