import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {ObColumnLayoutModule} from '@oblique/oblique';
import {TypographyComponent} from './typography/typography.component';
import {BlockElementsComponent} from './block-elements/block-elements.component';
import {InlineElementComponent} from './inline-element/inline-element.component';
import {ListsComponent} from './lists/lists.component';
import {PaletteComponent} from './palette/palette.component';
import {TableComponent} from './table/table.component';
import {StepperComponent} from './stepper/stepper.component';
import {TabsComponent} from './tabs/tabs.component';
import {AlertComponent} from './alert/alert.component';
import {IconSampleComponent} from './icon/icon.component';
import {GridComponent} from './grid/grid.component';
import {ScreenReaderOnlyComponent} from './screen-reader-only/screen-reader-only.component';
import {SharedModule} from '../common/shared.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'typography', component: TypographyComponent},
			{path: 'block', component: BlockElementsComponent},
			{path: 'grid', component: GridComponent},
			{path: 'icon', component: IconSampleComponent},
			{path: 'inline', component: InlineElementComponent},
			{path: 'lists', component: ListsComponent},
			{path: 'palette', component: PaletteComponent},
			{path: 'table', component: TableComponent},
			{path: 'stepper', component: StepperComponent},
			{path: 'tabs', component: TabsComponent},
			{path: 'alert', component: AlertComponent},
			{path: 'screen-reader-only', component: ScreenReaderOnlyComponent},
			{path: '', redirectTo: 'typography', pathMatch: 'full'}
		]),
		FormsModule,
		MatRadioModule,
		ObColumnLayoutModule,
		ReactiveFormsModule,
		SharedModule
	],
	declarations: [
		AlertComponent,
		BlockElementsComponent,
		GridComponent,
		IconSampleComponent,
		InlineElementComponent,
		ListsComponent,
		PaletteComponent,
		ScreenReaderOnlyComponent,
		StepperComponent,
		TableComponent,
		TabsComponent,
		TypographyComponent
	]
})
export class StylesModule {}
