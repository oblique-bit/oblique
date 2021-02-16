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
import {MatDialogModule} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CdkTableModule} from '@angular/cdk/table';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {ObColumnLayoutModule, ObSelectableModule, ObInputClearModule, ObButtonModule, ObIconModule} from 'oblique';
import {ObButtonComponent} from './button/button.component';
import {ObCardComponent} from './card/card.component';
import {ObChipsComponent} from './chips/chips.component';
import {ObSliderComponent} from './slider/slider.component';
import {ObBadgeComponent} from './badge/badge.component';
import {ObDialogComponent} from './dialog/dialog.component';
import {ObExampleDialogComponent} from './dialog/example-dialog/example-dialog.component';
import {ObExpansionPanelComponent} from './expansion-panel/expansion-panel.component';
import {ObProgressBarComponent} from './progress-bar/progress-bar.component';
import {ObTableComponent} from './table/table.component';
import {ObTooltipComponent} from './tooltip/tooltip.component';
import {ObStepperVerticalComponent} from './stepper-vertical/stepper-vertical.component';
import {ObStepperHorizontalComponent} from './stepper-horizontal/stepper-horizontal.component';
import {ObTabsComponent} from './tabs/tabs.component';
import {ObIconSampleComponent} from './icon/icon.sample.component';
import {SamplesModule} from '../samples/samples.module';

const appRoutes: Routes = [
	{path: 'badge', component: ObBadgeComponent},
	{path: 'button', component: ObButtonComponent},
	{path: 'card', component: ObCardComponent},
	{path: 'chips', component: ObChipsComponent},
	{path: 'dialog', component: ObDialogComponent},
	{path: 'expansion-panel', component: ObExpansionPanelComponent},
	{path: 'icon', component: ObIconSampleComponent},
	{path: 'progress-bar', component: ObProgressBarComponent},
	{path: 'slider', component: ObSliderComponent},
	{path: 'stepper-horizontal', component: ObStepperHorizontalComponent},
	{path: 'stepper-vertical', component: ObStepperVerticalComponent},
	{path: 'table', component: ObTableComponent},
	{path: 'tabs', component: ObTabsComponent},
	{path: 'tooltip', component: ObTooltipComponent},
	{path: '', redirectTo: 'card', pathMatch: 'full'}
];

@NgModule({
	declarations: [
		ObBadgeComponent,
		ObButtonComponent,
		ObCardComponent,
		ObChipsComponent,
		ObDialogComponent,
		ObExampleDialogComponent,
		ObExpansionPanelComponent,
		ObIconSampleComponent,
		ObProgressBarComponent,
		ObSliderComponent,
		ObStepperHorizontalComponent,
		ObStepperVerticalComponent,
		ObTabsComponent,
		ObTableComponent,
		ObTooltipComponent
	],
	imports: [
		CommonModule,
		ObButtonModule,
		ObColumnLayoutModule,
		ObInputClearModule,
		ObIconModule,
		ReactiveFormsModule,
		ObSelectableModule,
		FormsModule,
		RouterModule.forChild(appRoutes),
		MatAutocompleteModule,
		MatBadgeModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDialogModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatOptionModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatTooltipModule,
		CdkTableModule,
		SamplesModule
	]
})
export class MaterialModule {}
