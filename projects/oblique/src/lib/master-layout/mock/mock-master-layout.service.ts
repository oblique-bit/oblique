import {Injectable} from '@angular/core';
import {ObMasterLayoutHeaderService} from '../master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from '../master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutNavigationService} from '../master-layout.module';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';

@Injectable()
export class ObMockMasterLayoutService {
	constructor(
		public readonly header: ObMasterLayoutHeaderService,
		public readonly footer: ObMasterLayoutFooterService,
		public readonly navigation: ObMasterLayoutNavigationService,
		public readonly layout: ObMasterLayoutComponentService
	) {}
}
