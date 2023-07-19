import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-secondary-wheelchair',
	templateUrl: './button-example-secondary-wheelchair.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatButtonModule, ObButtonModule, MatIconModule]
})
export class ButtonExampleSecondaryWheelchairComponent implements PreviewComponent {}
