import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-unsaved-changes-example-stackblitz-link-preview',
	templateUrl: './unsaved-changes-example-stackblitz-link-preview.component.html',
	standalone: true,
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule]
})
export class UnsavedChangesExampleStackblitzLinkPreviewComponent {}
