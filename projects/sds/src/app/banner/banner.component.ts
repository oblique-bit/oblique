import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-banner',
	standalone: true,
	imports: [MatTooltipModule, ObExternalLinkModule],
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class BannerComponent {
	@Input() content: string;
}
