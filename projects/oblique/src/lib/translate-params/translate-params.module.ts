import {NgModule} from '@angular/core';
import {ObTranslateParamsPipe} from './translate-params.pipe';

export {ObTranslateParamsPipe} from './translate-params.pipe';

@NgModule({
	imports: [ObTranslateParamsPipe],
	exports: [ObTranslateParamsPipe]
})
export class ObTranslateParamsModule {}
