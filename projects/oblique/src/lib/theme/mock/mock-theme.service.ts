import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FONTS, THEMES} from '../theme.service';

@Injectable()
export class ObMockThemeService {
	theme$ = new BehaviorSubject<THEMES | string>(THEMES.MATERIAL);
	private currentTheme: string;

	setTheme(theme: THEMES | string): void {
		this.currentTheme = theme;
		this.theme$.next(theme);
	}

	setFont(font: FONTS): void {
	}

	isMaterial(): boolean {
		return this.currentTheme === THEMES.MATERIAL;
	}

	deprecated(component: string, target: string): void {
	}

	setDefaultFont(): void {
	}
}
