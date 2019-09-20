import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CardComponent} from './card/card.component';
import {ChipsComponent} from './chips/chips.component';
import {SliderComponent} from './slider/slider.component';
import {BadgeComponent} from './badge/badge.component';
import {ExpansionPanelComponent} from './expansion-panel/expansion-panel.component';
import {ProgressBarComponent} from './progress-bar/progress-bar.component';
import {ColumnLayoutModule, ObSelectableModule} from 'oblique';

const appRoutes: Routes = [
	{path: 'badge', component: BadgeComponent},
	{path: 'card', component: CardComponent},
	{path: 'chips', component: ChipsComponent},
	{path: 'expansion-panel', component: ExpansionPanelComponent},
	{path: 'progress-bar', component: ProgressBarComponent},
	{path: 'slider', component: SliderComponent},
	{path: '', redirectTo: 'card', pathMatch: 'full'}
];

@NgModule({
	declarations: [
		BadgeComponent,
		CardComponent,
		ChipsComponent,
		ExpansionPanelComponent,
		ProgressBarComponent,
		SliderComponent
	],
	imports: [
		CommonModule,
		ColumnLayoutModule,
		ReactiveFormsModule,
		ObSelectableModule,
		FormsModule,
		RouterModule.forChild(appRoutes),
		MatAutocompleteModule,
		MatBadgeModule,
		MatButtonModule,
		MatCardModule,
		MatChipsModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatOptionModule,
		MatProgressBarModule,
		MatRadioModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatTooltipModule
	]
})
export class MaterialModule {
}
