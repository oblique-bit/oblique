import {Subject} from 'rxjs';
import {ObTourService} from '../tour.service';
import {ObTourConfig} from '../../models/tour-config.model';

export class ObTourServiceMock implements Partial<ObTourService> {
	updateConfig = new Subject<ObTourConfig[]>();

	init: (config: ObTourConfig[]) => void = jest.fn();
	getConfig = jest.fn<ObTourConfig[] | null, []>();

	emitUpdate(config: ObTourConfig[]): void {
		this.updateConfig.next(config);
	}
}
