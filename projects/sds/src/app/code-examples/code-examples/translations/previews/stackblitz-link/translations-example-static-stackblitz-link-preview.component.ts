import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-translations-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './translations-example-static-stackblitz-link-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TranslationsExampleStaticStackblitzLinkPreviewComponent {}
