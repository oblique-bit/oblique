import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {obliqueProviders} from '../utilities';
import {ObButtonModule} from '../button/button.module';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObServiceNavigationAuthenticationComponent} from './authentication/service-navigation-authentication.component';
import {ObServiceNavigationComponent} from './service-navigation.component';

@NgModule({
	providers: [...obliqueProviders()],
	imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, ObButtonModule, ObExternalLinkModule, TranslateModule],
	declarations: [ObServiceNavigationAuthenticationComponent, ObServiceNavigationComponent],
	exports: [ObServiceNavigationComponent]
})
export class ObServiceNavigationModule {}
