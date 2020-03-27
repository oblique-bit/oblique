import {NgModule} from '@angular/core';
import {ObMockPopUpService} from './mock-pop-up.service';
import {ObPopUpService} from '../pop-up.service';

export {ObMockPopUpService} from './mock-pop-up.service';

@NgModule({
	providers: [{provide: ObPopUpService, useClass: ObMockPopUpService}]
})
export class ObMockPopUpModule {}
