import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-banner-example-default-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './banner-example-default-preview.component.html',
})
export class BannerExampleDefaultPreviewComponent {}
