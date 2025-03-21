import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';

@Component({
	selector: 'app-chips-example-primary-color-preview',
	templateUrl: './chips-example-color-preview.component.html',
	imports: [MatChipsModule, MatInputModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipsExampleColorPreviewComponent {}
