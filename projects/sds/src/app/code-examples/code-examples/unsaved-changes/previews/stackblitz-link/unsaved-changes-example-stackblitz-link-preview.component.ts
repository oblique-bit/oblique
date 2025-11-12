import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObExternalLinkModule} from '@oblique/oblique';

@Component({
	selector: 'app-unsaved-changes-example-stackblitz-link-preview',
	imports: [ObExternalLinkModule, MatButtonModule, ObButtonModule],
	templateUrl: './unsaved-changes-example-stackblitz-link-preview.component.html',
})
export class UnsavedChangesExampleStackblitzLinkPreviewComponent {}
