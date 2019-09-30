import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {CardComponent} from './card/card.component';
import {SliderComponent} from './slider/slider.component';
import {BadgeComponent} from './badge/badge.component';
import {ExpansionPanelComponent} from './expansion-panel/expansion-panel.component';
import {ColumnLayoutModule, ObSelectableModule} from 'oblique';

const appRoutes: Routes = [
	{path: 'badge', component: BadgeComponent},
	{path: 'card', component: CardComponent},
	{path: 'expansion-panel', component: ExpansionPanelComponent},
	{path: 'slider', component: SliderComponent},
	{path: '', redirectTo: 'card', pathMatch: 'full'}
];

@NgModule({
	declarations: [
		BadgeComponent,
		CardComponent,
		ExpansionPanelComponent,
		SliderComponent
	],
	imports: [
		CommonModule,
		ColumnLayoutModule,
		ObSelectableModule,
		FormsModule,
		RouterModule.forChild(appRoutes),
		MatBadgeModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatRadioModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatExpansionModule
	]
})
export class MaterialModule {
}
