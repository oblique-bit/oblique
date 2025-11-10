import {Component, ViewEncapsulation, input} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-banner',
	imports: [MatTooltipModule, ObExternalLinkModule],
	standalone: true,
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.scss',
	encapsulation: ViewEncapsulation.None,
})
export class BannerComponent {
	readonly content = input<string>(undefined);
}
