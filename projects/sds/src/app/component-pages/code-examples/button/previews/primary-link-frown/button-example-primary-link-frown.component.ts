import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-primary-link-frown',
	templateUrl: './button-example-primary-link-frown.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonExamplePrimaryLinkFrownComponent implements PreviewComponent {}
