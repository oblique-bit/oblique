import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LogoComponent} from './logo/logo.component';

@Component({
	selector: 'ssr-home',
	imports: [LogoComponent],
	templateUrl: './home.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class HomeComponent {}
