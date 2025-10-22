import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-translations-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './translations-example-stackblitz-link-preview.component.html'
})
export class TranslationsExampleStackblitzLinkPreviewComponent {}
