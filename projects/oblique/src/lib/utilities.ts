import {HttpClient} from '@angular/common/http';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';

export function createTranslateLoader(http: HttpClient) {
	return new MultiTranslateHttpLoader(http, [
		{prefix: './assets/i18n/', suffix: '.json'},
		{prefix: './assets/styles/i18n/', suffix: '.json'},
	]);
}
