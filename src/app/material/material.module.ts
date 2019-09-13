import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from './card/card.component';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule, MatListModule, MatTooltipModule, MatSlideToggleModule, MatButtonModule} from '@angular/material';
import {ColumnLayoutModule, ObSelectableModule} from 'oblique';


const appRoutes: Routes = [
	{path: 'card', component: CardComponent},
	{path: '', redirectTo: 'card', pathMatch: 'full'}
];

@NgModule({
	declarations: [CardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(appRoutes),
		MatCardModule,
		MatListModule,
		MatTooltipModule,
		MatSlideToggleModule,
		MatButtonModule,
		ColumnLayoutModule,
		ObSelectableModule
	]
})
export class MaterialModule {
}
