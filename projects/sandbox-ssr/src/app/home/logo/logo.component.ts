import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'ssr-logo',
	templateUrl: './logo.component.html',
	styleUrl: './logo.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class LogoComponent {}
