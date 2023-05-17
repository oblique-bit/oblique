import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IdModule} from '../shared/id/id.module';
import {AccordionLinksComponent} from './accordion-links/accordion-links.component';
import {ImageComponent} from './image/image.component';
import {SideNavigationComponent} from './side-navigation.component';
import {VersionComponent} from './version/version.component';

@NgModule({
	declarations: [AccordionLinksComponent, ImageComponent, SideNavigationComponent, VersionComponent],
	imports: [CommonModule, IdModule, ReactiveFormsModule, RouterModule],
	exports: [SideNavigationComponent]
})
export class SideNavigationModule {}
