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
import {CardComponent} from './card/card.component';
import {SliderComponent} from './slider/slider.component';
import {ColumnLayoutModule, ObSelectableModule} from 'oblique';

const appRoutes: Routes = [
	{path: 'card', component: CardComponent},
	{path: 'slider', component: SliderComponent},
	{path: '', redirectTo: 'card', pathMatch: 'full'}
];

@NgModule({
	declarations: [CardComponent, SliderComponent],
	imports: [
		CommonModule,
		ColumnLayoutModule,
		ObSelectableModule,
		FormsModule,
		RouterModule.forChild(appRoutes),
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatListModule,
		MatRadioModule,
		MatSlideToggleModule,
		MatTooltipModule
	]
})
export class MaterialModule {
}
