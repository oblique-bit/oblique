import {NgModule} from '@angular/core';
import {obliqueProviders} from '../utilities';
import {ObCollapseComponent} from './collapse.component';

export {
	OBLIQUE_COLLAPSE_ACTIVE,
	OBLIQUE_COLLAPSE_DURATION,
	OBLIQUE_COLLAPSE_ICON_POSITION,
	ObCollapseComponent
} from './collapse.component';

@NgModule({
	imports: [ObCollapseComponent],
	providers: obliqueProviders(),
	exports: [ObCollapseComponent]
})
export class ObCollapseModule {}
