import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-banner-example-default-preview',
	templateUrl: './banner-example-default-preview.component.html',
	standalone: true,
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class BannerExampleDefaultPreviewComponent {}
