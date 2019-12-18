import {Injectable} from '@angular/core';
import {MasterLayoutHeaderService} from '../master-layout-header/master-layout-header.service';
import {MasterLayoutFooterService} from '../master-layout-footer/master-layout-footer.service';
import {MasterLayoutNavigationService} from '../master-layout.module';
import {MasterLayoutComponentService} from '../master-layout/master-layout.component.service';

@Injectable()
export class MockMasterLayoutService {
	constructor(
		public readonly header: MasterLayoutHeaderService,
		public readonly footer: MasterLayoutFooterService,
		public readonly navigation: MasterLayoutNavigationService,
		public readonly layout: MasterLayoutComponentService
	) {
	}
}
