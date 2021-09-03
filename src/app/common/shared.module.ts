import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObDescriptionComponent} from '../description/description.component';
import {ObApiComponent} from '../api/api.component';
import {ObApiElementComponent} from '../api/api-element.component';

@NgModule({
	declarations: [ObDescriptionComponent, ObApiComponent, ObApiElementComponent],
	imports: [CommonModule],
	exports: [ObDescriptionComponent, ObApiComponent, ObApiElementComponent]
})
export class SharedModule {}
