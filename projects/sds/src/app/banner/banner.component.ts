import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObExternalLinkModule} from '@oblique/oblique';
import {SafeHtmlPipe} from '../shared/safeHtml/safeHtml.pipe';

@Component({
	selector: 'app-banner',
	standalone: true,
	imports: [MatTooltipModule, ObExternalLinkModule, SafeHtmlPipe],
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class BannerComponent {
	@Input() content: string;
}
