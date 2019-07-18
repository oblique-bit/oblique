import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MaterialConfigService} from './material-config.service';

@Injectable({
	providedIn: 'root'
})
export class MaterialService {

	private readonly enabledSubject: Subject<boolean> = new Subject<boolean>();
	private readonly toggled$ = this.enabledSubject.asObservable();
	private isEnabled: boolean;

	constructor(private readonly config: MaterialConfigService) {
		this.enabled = config.enabled;
	}

	get toggled(): Observable<boolean> {
		return this.toggled$;
	}

	get enabled(): boolean {
		return this.isEnabled;
	}

	set enabled(value: boolean) {
		this.isEnabled = value;
		this.enabledSubject.next(value);
	}

	deprecated(component: string, target: string): void {
		if (!this.isEnabled) {
			console.warn(`Oblique's "${component}" should not be used with Material Design, prefer the Angular implementation:
			https://material.angular.io/components/${target}.`);
		}
	}
}
