import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatTooltip} from '@angular/material/tooltip';
import {RouterModule, type Routes} from '@angular/router';
import {ObButtonModule, ObExternalLinkModule, ObNavTreeModule} from '@oblique/oblique';
import {NavPageComponent} from './nav-page/nav-page.component';
import {TablePageComponent} from './table-page/table-page.component';
import {TitlePageComponent} from './title-page/title-page.component';

const appRoutes: Routes = [
	{path: 'title-page', component: TitlePageComponent},
	{path: 'nav-page', component: NavPageComponent},
	{path: 'table-page', component: TablePageComponent},
	{path: '', redirectTo: 'title-page', pathMatch: 'full'}
];

@NgModule({
	declarations: [NavPageComponent, TablePageComponent, TitlePageComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatCheckbox,
		MatIconModule,
		MatTableModule,
		MatTooltip,
		ObButtonModule,
		ObExternalLinkModule,
		ObNavTreeModule,
		RouterModule.forChild(appRoutes)
	]
})
export class StarterkitModule {}
