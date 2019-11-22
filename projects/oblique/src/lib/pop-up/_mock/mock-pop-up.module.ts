import {NgModule} from '@angular/core';
import {MockPopUpService} from './mock-pop-up.service';
import {PopUpService} from '../pop-up.service';

export {MockPopUpService} from './mock-pop-up.service';

@NgModule({
	providers: [{provide: PopUpService, useClass: MockPopUpService}]
})
export class MockPopUpModule {
}
