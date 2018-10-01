import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ErrorMessagesComponent} from './error-messages.component';
import {ErrorMessagesService} from './error-messages.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule
	],
	declarations: [ErrorMessagesComponent],
	exports: [ErrorMessagesComponent]
})
export class ErrorMessagesModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ErrorMessagesModule,
			providers: [ErrorMessagesService]
		};
	}
}
