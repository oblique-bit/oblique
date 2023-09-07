import {NgModule} from '@angular/core';

import {obliqueProviders} from '../utilities';
import {ObSpinnerComponent} from './spinner.component';

export {ObSpinnerComponent} from './spinner.component';
export {ObISpinnerEvent} from './spinner.model';
export {ObSpinnerService} from './spinner.service';

@NgModule({
	imports: [ObSpinnerComponent],
	providers: obliqueProviders(),
	exports: [ObSpinnerComponent]
})
export class ObSpinnerModule {}
