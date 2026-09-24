import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-translations-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './translations-example-static-stackblitz-link-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TranslationsExampleStaticStackblitzLinkPreviewComponent {}
