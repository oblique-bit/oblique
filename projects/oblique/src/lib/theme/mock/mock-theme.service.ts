import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {THEMES} from '../theme.service';

@Injectable()
export class MockThemeService {
	theme$ = new BehaviorSubject<THEMES>(THEMES.MATERIAL);
	private currentTheme: string;

	setTheme(theme: THEMES): void {
		this.currentTheme = theme;
		this.theme$.next(theme);
	}

	isMaterial(): boolean {
		return this.currentTheme === THEMES.MATERIAL;
	}

	deprecated(component: string, target: string): void {
	}

	setDefaultTheme(): void {
	}

	setFrutiger(enabled: boolean): void {
	}
}
