import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
	selector: 'ssr-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html'
})
export class AppComponent {
	title = 'sandbox-ssr';
}
