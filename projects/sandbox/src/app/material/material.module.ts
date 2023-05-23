import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CdkTableModule} from '@angular/cdk/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
	ObAlertModule,
	ObButtonModule,
	ObCheckboxModule,
	ObColumnLayoutModule,
	ObErrorMessagesModule,
	ObIconModule,
	ObInputClearModule,
	ObSelectableModule,
	ObSpinnerModule
} from '@oblique/oblique';
import {ButtonComponent} from './button/button.component';
import {CardComponent} from './card/card.component';
import {ChipsComponent} from './chips/chips.component';
import {SliderComponent} from './slider/slider.component';
import {BadgeComponent} from './badge/badge.component';
import {DialogComponent} from './dialog/dialog.component';
import {ExampleDialogComponent} from './dialog/example-dialog/example-dialog.component';
import {ExpansionPanelComponent} from './expansion-panel/expansion-panel.component';
import {ListComponent} from './list/list.component';
import {ProgressBarComponent} from './progress-bar/progress-bar.component';
import {TableComponent} from './table/table.component';
import {TooltipComponent} from './tooltip/tooltip.component';
import {StepperVerticalComponent} from './stepper-vertical/stepper-vertical.component';
import {StepperHorizontalComponent} from './stepper-horizontal/stepper-horizontal.component';
import {TabsComponent} from './tabs/tabs.component';
import {IconSampleComponent} from './icon/icon.sample.component';
import {MandatorySampleComponent} from './mandatory/mandatory.sample.component';
import {SharedModule} from '../common/shared.module';
import {FormComponent} from './form/form.component';
import {TableEditComponent} from './table/table-edit.component';
import {ObPaginatorModule} from '@oblique/paginator/ob-paginator.module';
import {ObFormFieldModule} from '@oblique/form-field/form-field.module';

const appRoutes: Routes = [
	{path: 'badge', component: BadgeComponent},
	{path: 'button', component: ButtonComponent},
	{path: 'card', component: CardComponent},
	{path: 'chips', component: ChipsComponent},
	{path: 'dialog', component: DialogComponent},
	{path: 'expansion-panel', component: ExpansionPanelComponent},
	{path: 'form', component: FormComponent},
	{path: 'icon', component: IconSampleComponent},
	{path: 'list', component: ListComponent},
	{path: 'mandatory', component: MandatorySampleComponent},
	{path: 'progress-bar', component: ProgressBarComponent},
	{path: 'slider', component: SliderComponent},
	{path: 'stepper-horizontal', component: StepperHorizontalComponent},
	{path: 'stepper-vertical', component: StepperVerticalComponent},
	{path: 'table', component: TableComponent},
	{path: 'tabs', component: TabsComponent},
	{path: 'tooltip', component: TooltipComponent},
	{path: '', redirectTo: 'card', pathMatch: 'full'}
];

@NgModule({
	declarations: [
		BadgeComponent,
		ButtonComponent,
		CardComponent,
		ChipsComponent,
		DialogComponent,
		ExampleDialogComponent,
		ExpansionPanelComponent,
		FormComponent,
		IconSampleComponent,
		ListComponent,
		MandatorySampleComponent,
		ProgressBarComponent,
		SliderComponent,
		StepperHorizontalComponent,
		StepperVerticalComponent,
		TableComponent,
		TableEditComponent,
		TabsComponent,
		TooltipComponent
	],
	imports: [
		CdkTableModule,
		CommonModule,
		FormsModule,
		MatAutocompleteModule,
		MatBadgeModule,
		MatButtonModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatDialogModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatNativeDateModule,
		MatOptionModule,
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
		ObAlertModule,
		ObButtonModule,
		ObCheckboxModule,
		ObColumnLayoutModule,
		ObErrorMessagesModule,
		ObFormFieldModule,
		ObIconModule,
		ObInputClearModule,
		ObPaginatorModule,
		ObSelectableModule,
		ObSpinnerModule,
		ReactiveFormsModule,
		RouterModule.forChild(appRoutes),
		SharedModule
	]
})
export class MaterialModule {}
