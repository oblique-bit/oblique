import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {ObButtonModule, ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-clickable-cards',
	templateUrl: './clickable-cards.component.html',
	styleUrls: ['./clickable-cards.component.scss'],
	standalone: true,
	imports: [MatButtonModule, MatCardModule, ObButtonModule, ObSelectableModule, RouterModule]
})
export class ClickableCardsComponent {}
