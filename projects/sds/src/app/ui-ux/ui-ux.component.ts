import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ObExternalLinkDirective} from '@oblique/oblique';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';
import {UiUxData} from '../cms/models/tabbed-page.model';
import {RelatedLinkPipe} from './related-link.pipe';

@Component({
	selector: 'app-ui-ux',
	templateUrl: './ui-ux.component.html',
	styleUrls: ['./ui-ux.component.scss'],
	standalone: true,
	imports: [CommonModule, SafeHtmlPipe, RouterLink, RelatedLinkPipe, ObExternalLinkDirective]
})
export class UiUxComponent {
	@Input() uiUx?: UiUxData;
}
