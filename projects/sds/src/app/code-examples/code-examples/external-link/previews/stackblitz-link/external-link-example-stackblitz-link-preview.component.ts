import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-external-link-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './external-link-example-stackblitz-link-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ExternalLinkExampleStackblitzLinkPreviewComponent {}
