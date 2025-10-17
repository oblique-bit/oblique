import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-button-example-colors',
	imports: [MatButtonModule, ObButtonModule, MatIconModule],
	templateUrl: './button-example-colors.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {class: 'layout-breakpoint-sm'}
})
export class ButtonExampleColorsComponent {}
