import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ObAlertModule, ObButtonModule} from '@oblique/oblique';
import {CodeExampleDirective} from './code-example.directive';
import {AlertCodeExamplesComponent} from './code-examples/alert/alert-code-examples.component';
import {BannerCodeExamplesComponent} from './code-examples/banner/banner-code-examples.component';
import {CodeExampleComponent} from './code-examples/code-example/code-example.component';
import {NoCodeExamplesMatchComponent} from './code-examples/no-match/no-code-examples-match.component';
import {ComponentPagesRoutingModule} from './component-pages-routing.module';
import {ComponentPagesComponent} from './component-pages/component-pages.component';
import {TabComponent} from './tabs/tab/tab.component';
import {TabsComponent} from './tabs/tabs.component';
import {IdModule} from '../shared/id/id.module';
import {AlertExampleInfoPreviewComponent} from './code-examples/alert/previews/info/alert-example-info-preview.component';
import {AlertExampleSuccessPreviewComponent} from './code-examples/alert/previews/success/alert-example-success-preview.component';
import {HighlightedCodeComponent} from './code-examples/code-example/highlighted-code/highlighted-code.component';
import {ButtonCodeExamplesComponent} from './code-examples/button/button-code-examples.component';
import {ButtonExamplePrimaryLinkFrownComponent} from './code-examples/button/previews/primary-link-frown/button-example-primary-link-frown.component';
import {ButtonExamplePrimaryLoginDisabledComponent} from './code-examples/button/previews/primary-login-disabled/button-example-primary-login-disabled.component';
import {ButtonExampleSecondaryLinkNoIconComponent} from './code-examples/button/previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component';
import {ButtonExampleSecondaryWheelchairComponent} from './code-examples/button/previews/secondary-wheelchair/button-example-secondary-wheelchair.component';
import {ButtonExampleTertiaryLinkNoIconDisabledComponent} from './code-examples/button/previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component';
import {ButtonExampleTertiaryRepeatNoTextComponent} from './code-examples/button/previews/tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
	declarations: [
		AlertCodeExamplesComponent,
		AlertExampleInfoPreviewComponent,
		AlertExampleSuccessPreviewComponent,
		BannerCodeExamplesComponent,
		ButtonCodeExamplesComponent,
		ButtonExamplePrimaryLinkFrownComponent,
		ButtonExamplePrimaryLoginDisabledComponent,
		ButtonExampleSecondaryLinkNoIconComponent,
		ButtonExampleSecondaryWheelchairComponent,
		ButtonExampleTertiaryLinkNoIconDisabledComponent,
		ButtonExampleTertiaryRepeatNoTextComponent,
		CodeExampleComponent,
		CodeExampleDirective,
		ComponentPagesComponent,
		HighlightedCodeComponent,
		NoCodeExamplesMatchComponent,
		TabComponent,
		TabsComponent
	],
	imports: [CommonModule, ComponentPagesRoutingModule, IdModule, MatButtonModule, MatIconModule, ObAlertModule, ObButtonModule]
})
export class ComponentPagesModule {}
