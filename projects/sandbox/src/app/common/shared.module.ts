import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DescriptionComponent} from '../description/description.component';
import {ApiComponent} from '../api/api.component';
import {ApiElementComponent} from '../api/api-element.component';

@NgModule({
	declarations: [ApiComponent, ApiElementComponent, DescriptionComponent],
	imports: [CommonModule],
	exports: [ApiComponent, ApiElementComponent, DescriptionComponent]
})
export class SharedModule {}
