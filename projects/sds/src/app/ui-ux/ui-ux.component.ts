import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ObExternalLinkDirective} from '@oblique/oblique';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
import type {UiUxData} from '../cms/models/tabbed-page.model';
import {RelatedLinkPipe} from './related-link.pipe';

@Component({
	selector: 'app-ui-ux',
	templateUrl: './ui-ux.component.html',
	styleUrl: './ui-ux.component.scss',
	standalone: true,
	imports: [SafeHtmlPipe, RouterLink, RelatedLinkPipe, ObExternalLinkDirective]
})
export class UiUxComponent {
	readonly uiUx = input<UiUxData>(undefined);
}
