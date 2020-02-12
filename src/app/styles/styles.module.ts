import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TypographyComponent} from './typography/typography.component';
import {BlockElementsComponent} from './block-elements/block-elements.component';
import {InlineElementComponent} from './inline-element/inline-element.component';
import {ListsComponent} from './lists/lists.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{path: 'typography', component: TypographyComponent},
			{path: 'block', component: BlockElementsComponent},
			{path: 'inline', component: InlineElementComponent},
			{path: 'lists', component: ListsComponent},
			{path: '', redirectTo: 'typography', pathMatch: 'full'}
		])
	],
	declarations: [
		TypographyComponent,
		BlockElementsComponent,
		InlineElementComponent,
		ListsComponent
	]
})
export class StylesModule {}
