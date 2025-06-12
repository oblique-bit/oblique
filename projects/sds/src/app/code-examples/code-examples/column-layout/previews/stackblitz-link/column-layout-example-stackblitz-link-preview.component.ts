import {Component} from '@angular/core';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-column-layout-example-stackblitz-link-preview',
	templateUrl: './column-layout-example-stackblitz-link-preview.component.html',
	styleUrl: '../../../../stackblitz-link.scss',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class ColumnLayoutExampleStackblitzLinkPreviewComponent {}
