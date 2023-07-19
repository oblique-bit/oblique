import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-primary-login-disabled',
	templateUrl: './button-example-primary-login-disabled.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatButtonModule, ObButtonModule, MatIconModule]
})
export class ButtonExamplePrimaryLoginDisabledComponent implements PreviewComponent {}
