import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterModule} from '@angular/router';
import {ObButtonModule, ObSelectableModule} from '@oblique/oblique';

@Component({
	selector: 'app-clickable-cards',
	templateUrl: './clickable-cards.component.html',
	styleUrl: './clickable-cards.component.scss',
	imports: [MatButtonModule, MatCardModule, ObButtonModule, ObSelectableModule, RouterModule]
})
export class ClickableCardsComponent {}
