import {Component} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObExternalLinkModule} from '@oblique/oblique';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'app-banner',
	standalone: true,
	imports: [MatTooltipModule, ObExternalLinkModule, RouterLink],
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.scss'
})
export class BannerComponent {}
