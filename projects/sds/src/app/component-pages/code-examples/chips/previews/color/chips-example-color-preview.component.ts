import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';

@Component({
	standalone: true,
	selector: 'app-chips-example-primary-color-preview',
	templateUrl: './chips-example-color-preview.component.html',
	imports: [MatChipsModule, MatInputModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsExampleColorPreviewComponent implements PreviewComponent {}
