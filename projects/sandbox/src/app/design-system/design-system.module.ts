import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from '@oblique/design-system';
import {DesignSystemRoutingModule} from './design-system-routing.module';
import {DesignSystemComponent} from './design-system.component';

@NgModule({
	imports: [CommonModule, DemoComponent, DesignSystemRoutingModule],
	declarations: [DesignSystemComponent],
})
export class DesignSystemModule {}
