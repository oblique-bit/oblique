import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ObAlertModule} from '@oblique/oblique';
import {CodeExampleDirective} from './code-example.directive';
import {AlertCodeExamplesComponent} from './code-examples/alert/alert-code-examples.component';
import {BannerCodeExamplesComponent} from './code-examples/banner/banner-code-examples.component';
import {CodeExampleComponent} from './code-examples/code-example/code-example.component';
import {NoCodeExamplesMatchComponent} from './code-examples/no-match/no-code-examples-match.component';
import {ComponentPagesRoutingModule} from './component-pages-routing.module';
import {ComponentPagesComponent} from './component-pages.component';
import {TabComponent} from './tabs/tab/tab.component';
import {TabsComponent} from './tabs/tabs.component';
import {IdModule} from '../shared/id/id.module';
import {AlertExampleInfoPreviewComponent} from './code-examples/alert/alert-example-info-preview/alert-example-info-preview.component';
import {AlertExampleSuccessPreviewComponent} from './code-examples/alert/alert-example-success-preview/alert-example-success-preview.component';
import {HighlightedCodeComponent} from './code-examples/code-example/highlighted-code/highlighted-code.component';

@NgModule({
	declarations: [
		AlertCodeExamplesComponent,
		AlertExampleInfoPreviewComponent,
		AlertExampleSuccessPreviewComponent,
		BannerCodeExamplesComponent,
		CodeExampleComponent,
		CodeExampleDirective,
		ComponentPagesComponent,
		HighlightedCodeComponent,
		NoCodeExamplesMatchComponent,
		TabComponent,
		TabsComponent
	],
	imports: [CommonModule, ComponentPagesRoutingModule, IdModule, ObAlertModule]
})
export class ComponentPagesModule {}
