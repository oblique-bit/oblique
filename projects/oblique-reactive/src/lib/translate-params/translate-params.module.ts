import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {TranslateParamsPipe} from './translate-params.pipe';

export {TranslateParamsPipe} from './translate-params.pipe';

@NgModule({
	declarations: [TranslateParamsPipe],
	imports: [TranslateModule],
	exports:  [TranslateParamsPipe]
})
export class TranslateParamsModule {
}
