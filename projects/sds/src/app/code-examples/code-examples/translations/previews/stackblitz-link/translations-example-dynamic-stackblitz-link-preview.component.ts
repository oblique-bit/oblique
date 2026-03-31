import {Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-translations-example-dynamic-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './translations-example-dynamic-stackblitz-link-preview.component.html',
	styleUrl: '../../../../stackblitz-link.scss',
})
export class TranslationsExampleDynamicStackblitzLinkPreviewComponent {}
