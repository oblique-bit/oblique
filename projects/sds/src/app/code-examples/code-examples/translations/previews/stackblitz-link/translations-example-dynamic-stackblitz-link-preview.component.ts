import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-translations-example-dynamic-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './translations-example-dynamic-stackblitz-link-preview.component.html',
	styleUrl: '../../../../stackblitz-link.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TranslationsExampleDynamicStackblitzLinkPreviewComponent {}
