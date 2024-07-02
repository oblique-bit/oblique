import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
	selector: 'ssr-root',
	standalone: true,
	imports: [RouterOutlet, RouterLink],
	templateUrl: './app.component.html',
	styleUrl: 'app.component.scss'
})
export class AppComponent {}
