import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {LogoComponent} from './logo/logo.component';

@Component({
	selector: 'ssr-home',
	imports: [TranslateModule, LogoComponent],
	templateUrl: './home.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class HomeComponent {}
