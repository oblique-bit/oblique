import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CdkTableModule} from '@angular/cdk/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatOptionModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
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
	ObColumnLayoutModule,
	ObErrorMessagesModule,
	ObInputClearModule,
	ObSelectableModule,
	ObSpinnerModule
} from '@oblique/oblique';
import {ButtonComponent} from './button/button.component';
import {CardComponent} from './card/card.component';
import {ChipsComponent} from './chips/chips.component';
import {SliderComponent} from './slider/slider.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {BadgeComponent} from './badge/badge.component';
import {DatepickerComponent} from './datepicker/datepicker.component';
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
import {FormComponent} from './form/form.component';
import {TableEditComponent} from './table/table-edit.component';
import {ObPaginatorModule} from '@oblique/paginator/ob-paginator.module';
import {SlideToggleComponent} from './slide-toggle/slide-toggle.component';
import {MenuComponent} from './menu/menu.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const appRoutes: Routes = [
	{path: 'badge', component: BadgeComponent},
	{path: 'button', component: ButtonComponent},
	{path: 'card', component: CardComponent},
	{path: 'chips', component: ChipsComponent},
	{path: 'datepicker', component: DatepickerComponent},
	{path: 'dialog', component: DialogComponent},
	{path: 'expansion-panel', component: ExpansionPanelComponent},
	{path: 'form', component: FormComponent},
	{path: 'icon', component: IconSampleComponent},
	{path: 'list', component: ListComponent},
	{path: 'mandatory', component: MandatorySampleComponent},
	{path: 'menu', component: MenuComponent},
	{path: 'progress-bar', component: ProgressBarComponent},
	{path: 'slide-toggle', component: SlideToggleComponent},
	{path: 'slider', component: SliderComponent},
	{path: 'spinner', component: SpinnerComponent},
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
		MenuComponent,
		ProgressBarComponent,
		SliderComponent,
		SlideToggleComponent,
		SpinnerComponent,
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
		MatMenuModule,
		MatOptionModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatSelectModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatTooltipModule,
		NgOptimizedImage,
		ObAlertModule,
		ObButtonModule,
		ObColumnLayoutModule,
		ObErrorMessagesModule,
		ObInputClearModule,
		ObPaginatorModule,
		ObSelectableModule,
		ObSpinnerModule,
		ReactiveFormsModule,
		RouterModule.forChild(appRoutes)
	]
})
export class MaterialModule {}
