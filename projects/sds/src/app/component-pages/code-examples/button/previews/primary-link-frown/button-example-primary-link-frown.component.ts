import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PreviewComponent} from '../../../../code-examples.model';
import {ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-button-example-primary-link-frown',
	templateUrl: './button-example-primary-link-frown.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatButtonModule, ObButtonModule, MatIconModule]
})
export class ButtonExamplePrimaryLinkFrownComponent implements PreviewComponent {}
