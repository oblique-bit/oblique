import {Injectable} from '@angular/core';
import {ObMasterLayoutHeaderService} from '../master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from '../master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObMasterLayoutNavigationService} from '../master-layout-navigation/master-layout-navigation.service';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockMasterLayoutService {
	constructor(
		public readonly header: ObMasterLayoutHeaderService,
		public readonly footer: ObMasterLayoutFooterService,
		public readonly navigation: ObMasterLayoutNavigationService,
		public readonly layout: ObMasterLayoutComponentService
	) {}
}
