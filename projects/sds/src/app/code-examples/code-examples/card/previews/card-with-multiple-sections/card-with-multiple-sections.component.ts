import {NgOptimizedImage} from '@angular/common';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ObAlertModule, ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-card-with-multiple-sections',
	imports: [MatButtonModule, MatCardModule, NgOptimizedImage, ObAlertModule, ObButtonModule],
	templateUrl: './card-with-multiple-sections.component.html',
	styleUrl: './card-with-multiple-sections.component.scss',
})
export class CardWithMultipleSectionsComponent {}
