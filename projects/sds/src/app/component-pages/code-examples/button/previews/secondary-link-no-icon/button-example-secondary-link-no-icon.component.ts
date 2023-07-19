import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-secondary-link-no-icon',
	templateUrl: './button-example-secondary-link-no-icon.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatButtonModule, ObButtonModule]
})
export class ButtonExampleSecondaryLinkNoIconComponent implements PreviewComponent {}
