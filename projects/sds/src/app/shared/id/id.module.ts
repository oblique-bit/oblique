import {NgModule} from '@angular/core';
import {IdPipe} from './id.pipe';

@NgModule({
	declarations: [IdPipe],
	exports: [IdPipe]
})
export class IdModule {}
