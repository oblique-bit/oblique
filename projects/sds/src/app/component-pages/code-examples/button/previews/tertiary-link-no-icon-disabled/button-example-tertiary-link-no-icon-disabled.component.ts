import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-tertiary-link-no-icon-disabled',
	templateUrl: './button-example-tertiary-link-no-icon-disabled.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonExampleTertiaryLinkNoIconDisabledComponent implements PreviewComponent {}
