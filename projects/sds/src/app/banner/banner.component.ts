import {ChangeDetectionStrategy, Component, ViewEncapsulation, input} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-banner',
	imports: [MatTooltipModule, ObExternalLinkModule],
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
})
export class BannerComponent {
	readonly content = input<string>(undefined);
}
