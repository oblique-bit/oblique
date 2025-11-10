import {NgModule} from '@angular/core';

import {ObInputClearDirective} from './input-clear.directive';

export {ObInputClearDirective} from './input-clear.directive';

@NgModule({
	imports: [ObInputClearDirective],
	exports: [ObInputClearDirective],
})
export class ObInputClearModule {}
