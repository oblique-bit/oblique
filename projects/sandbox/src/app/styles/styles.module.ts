import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {ObColumnLayoutModule} from '@oblique/oblique';
import {TypographyComponent} from './typography/typography.component';
import {BlockElementsComponent} from './block-elements/block-elements.component';
import {InlineElementComponent} from './inline-element/inline-element.component';
import {ListsComponent} from './lists/lists.component';
import {PaletteComponent} from './palette/palette.component';
import {TableComponent} from './table/table.component';
import {AlertComponent} from './alert/alert.component';
import {IconSampleComponent} from './icon/icon.component';
import {GridComponent} from './grid/grid.component';
import {ScreenReaderOnlyComponent} from './screen-reader-only/screen-reader-only.component';
import {SharedModule} from '../common/shared.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'alert', component: AlertComponent},
			{path: 'block', component: BlockElementsComponent},
			{path: 'grid', component: GridComponent},
			{path: 'icon', component: IconSampleComponent},
			{path: 'inline', component: InlineElementComponent},
			{path: 'lists', component: ListsComponent},
			{path: 'palette', component: PaletteComponent},
			{path: 'screen-reader-only', component: ScreenReaderOnlyComponent},
			{path: 'table', component: TableComponent},
			{path: 'typography', component: TypographyComponent},
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
		TableComponent,
		TypographyComponent
	]
})
export class StylesModule {}
