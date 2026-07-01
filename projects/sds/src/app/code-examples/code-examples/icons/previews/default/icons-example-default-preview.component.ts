import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'app-icons-example-default-preview',
	imports: [MatIconModule],
	templateUrl: './icons-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class IconsExampleDefaultPreviewComponent {}
