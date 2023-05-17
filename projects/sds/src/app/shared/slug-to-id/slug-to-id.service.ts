import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SlugToIdService {
	readonly readyToMap: ReplaySubject<void> = new ReplaySubject<void>();

	private readonly dataSet: Record<string, number> = {};

	setupDataSet(values: Map<string, number>): void {
		values.forEach((value: number, key: string) => {
			this.dataSet[key] = value;
		});

		this.readyToMap.next();
	}

	getIdForSlug(slug: string): number {
		return this.dataSet[slug];
	}
}
