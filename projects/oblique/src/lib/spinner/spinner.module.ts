import {NgModule} from '@angular/core';

import {ObSpinnerComponent} from './spinner.component';

export {ObSpinnerComponent} from './spinner.component';
export {ObISpinnerEvent} from './spinner.model';
export {ObSpinnerService} from './spinner.service';

@NgModule({
	imports: [ObSpinnerComponent],
	exports: [ObSpinnerComponent]
})
export class ObSpinnerModule {}
