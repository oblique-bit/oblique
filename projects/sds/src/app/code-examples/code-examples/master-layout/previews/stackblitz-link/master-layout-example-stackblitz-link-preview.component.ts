import {MatButtonModule} from '@angular/material/button';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-master-layout-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './master-layout-example-stackblitz-link-preview.component.html',
	styleUrl: '../../../../stackblitz-link.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class MasterLayoutExampleStackblitzLinkPreviewComponent {}
