import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObAlertModule} from '@oblique/oblique';

@Component({
	selector: 'app-alert-example-has-role-alert-preview',
	imports: [ObAlertModule],
	templateUrl: './alert-example-has-role-alert-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class AlertExampleHasRoleAlertPreviewComponent {}
