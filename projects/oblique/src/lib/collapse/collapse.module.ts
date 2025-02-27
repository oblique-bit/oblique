import {NgModule} from '@angular/core';
import {ObCollapseComponent} from './collapse.component';

export {
	OBLIQUE_COLLAPSE_ACTIVE,
	OBLIQUE_COLLAPSE_DURATION,
	OBLIQUE_COLLAPSE_ICON_POSITION,
	ObCollapseComponent
} from './collapse.component';

@NgModule({
	imports: [ObCollapseComponent],
	exports: [ObCollapseComponent]
})
export class ObCollapseModule {}
