import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-button-example-other-options',
	templateUrl: './button-example-other-options.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ObButtonModule, MatButtonModule, MatTooltipModule, MatIconModule],
	host: {class: 'layout-breakpoint-sm'}
})
export class ButtonExampleOtherOptionsComponent {}
