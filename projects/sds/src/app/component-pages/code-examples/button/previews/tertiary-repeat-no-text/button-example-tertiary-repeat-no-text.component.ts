import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';

@Component({
	selector: 'app-button-example-tertiary-repeat-no-text',
	templateUrl: './button-example-tertiary-repeat-no-text.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonExampleTertiaryRepeatNoTextComponent implements PreviewComponent {}
