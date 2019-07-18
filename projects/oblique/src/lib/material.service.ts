import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {Observable, Subject} from 'rxjs';

export const MATERIAL_DESIGN_DISABLE = new InjectionToken<boolean>('MATERIAL_DESIGN_DISABLE');

@Injectable({
	providedIn: 'root'
})
export class MaterialService {

	private readonly enabledSubject: Subject<boolean> = new Subject<boolean>();
	private readonly toggled$ = this.enabledSubject.asObservable();
	private isEnabled: boolean;

	constructor(@Optional() @Inject(MATERIAL_DESIGN_DISABLE) isDisabled: boolean) {
		this.isEnabled = !isDisabled;
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
