import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DescriptionComponent} from '../description/description.component';
import {ApiComponent} from '../api/api.component';
import {ApiElementComponent} from '../api/api-element.component';

@NgModule({
	declarations: [DescriptionComponent, ApiComponent, ApiElementComponent],
	imports: [CommonModule],
	exports: [DescriptionComponent, ApiComponent, ApiElementComponent]
})
export class SharedModule {}
