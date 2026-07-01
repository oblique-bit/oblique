import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'app-icons-example-font-size-preview',
	imports: [MatIconModule],
	templateUrl: './icons-example-font-size-preview.component.html',
	styleUrl: './icons-example-font-size-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class IconsExampleFontSizePreviewComponent {}
