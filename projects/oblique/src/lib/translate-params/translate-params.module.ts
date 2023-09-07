import {NgModule} from '@angular/core';
import {ObTranslateParamsPipe} from './translate-params.pipe';
import {obliqueProviders} from '../utilities';

export {ObTranslateParamsPipe} from './translate-params.pipe';

@NgModule({
	imports: [ObTranslateParamsPipe],
	providers: obliqueProviders(),
	exports: [ObTranslateParamsPipe]
})
export class ObTranslateParamsModule {}
