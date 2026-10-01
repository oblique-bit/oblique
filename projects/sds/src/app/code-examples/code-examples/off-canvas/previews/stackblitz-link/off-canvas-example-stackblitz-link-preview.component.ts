import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-off-canvas-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './off-canvas-example-stackblitz-link-preview.component.html',
	styleUrl: '../../../../stackblitz-link.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class OffCanvasExampleStackblitzLinkPreviewComponent {}
