import {Injectable, signal} from '@angular/core';
import {ObTourConfig} from './../models/tour-config.model';
import {Subject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ObTourService {
	public readonly updateConfig = new Subject<ObTourConfig[]>();
	private readonly config = signal<ObTourConfig[] | null>(null);

	init(config: ObTourConfig[]): void {
		this.config.set(config);
		this.updateConfig.next(config);
	}
}
