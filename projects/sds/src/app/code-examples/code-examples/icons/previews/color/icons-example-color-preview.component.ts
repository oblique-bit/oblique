import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ObButtonDirective} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'app-icons-example-color-preview',
	templateUrl: './icons-example-color-preview.component.html',
	styleUrl: './icons-example-color-preview.component.scss',
	imports: [MatIconModule, ObButtonDirective, MatButtonModule],
	standalone: true
})
export class IconsExampleColorPreviewComponent {}
