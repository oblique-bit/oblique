import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-tertiary-link-no-icon-disabled',
	templateUrl: './button-example-tertiary-link-no-icon-disabled.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [MatButtonModule, ObButtonModule]
})
export class ButtonExampleTertiaryLinkNoIconDisabledComponent implements PreviewComponent {}
