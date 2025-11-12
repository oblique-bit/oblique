import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'app-invalid',
	imports: [RouterLink],
	templateUrl: './invalid.component.html',
	styleUrl: './invalid.component.scss',
	host: {class: 'content-page'},
})
export class InvalidComponent {}
