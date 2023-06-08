import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-secondary-wheelchair',
	templateUrl: './button-example-secondary-wheelchair.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonExampleSecondaryWheelchairComponent implements PreviewComponent {}
