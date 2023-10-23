import {MatButtonModule} from '@angular/material/button';
import {Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-master-layout-example-stackblitz-link-preview',
	templateUrl: './master-layout-example-stackblitz-link-preview.component.html',
	styleUrls: ['../../../../stackblitz-link.scss'],
	standalone: true,
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class MasterLayoutExampleStackblitzLinkPreviewComponent {}
