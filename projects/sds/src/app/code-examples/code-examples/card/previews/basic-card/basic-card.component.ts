import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
	selector: 'app-basic-card',
	imports: [MatCardModule],
	templateUrl: './basic-card.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class BasicCardComponent {}
