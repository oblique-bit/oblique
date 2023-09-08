import {Component} from '@angular/core';
import {ObAlertModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-alert-example-has-role-alert-preview',
	templateUrl: './alert-example-has-role-alert-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObAlertModule]
})
export class AlertExampleHasRoleAlertPreviewComponent implements PreviewComponent {}
