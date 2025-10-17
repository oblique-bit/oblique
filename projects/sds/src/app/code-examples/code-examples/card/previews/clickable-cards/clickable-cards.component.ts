import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {ObButtonModule, ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-clickable-cards',
	imports: [MatButtonModule, MatCardModule, ObButtonModule, ObSelectableModule, RouterModule],
	templateUrl: './clickable-cards.component.html',
	styleUrl: './clickable-cards.component.scss'
})
export class ClickableCardsComponent {}
