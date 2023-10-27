import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
	selector: 'app-basic-card',
	templateUrl: './basic-card.component.html',
	standalone: true,
	imports: [MatCardModule]
})
export class BasicCardComponent {}
