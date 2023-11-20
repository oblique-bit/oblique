import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-translations-example-stackblitz-link-preview',
	templateUrl: './translations-example-stackblitz-link-preview.component.html',
	styleUrls: ['./translations-example-stackblitz-link-preview.component.scss'],
	standalone: true,
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class TranslationsExampleStackblitzLinkPreviewComponent {}
