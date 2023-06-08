import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-primary-login-disabled',
	templateUrl: './button-example-primary-login-disabled.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonExamplePrimaryLoginDisabledComponent implements PreviewComponent {}
