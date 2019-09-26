import {Component, Pipe, PipeTransform} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

import {ThemeService} from 'oblique';

@Pipe({
	name: 'patternFilter'
})
export class PatternFilterPipe implements PipeTransform {
	transform(items: Array<any>, pattern = ''): Array<any> {
		pattern = pattern.replace(/[.*+?^@${}()|[\]\\]/g, '\\$&');
		return items.filter(item => new RegExp(pattern, 'gi').test(item));
	}
}

@Component({
	selector: 'app-filter-box',
	templateUrl: 'filter-box-sample.component.html',
	styles: [`
		.card-deck + .card-deck {
			margin-top: 1em;
		}
		::ng-deep .closed,
		::ng-deep [aria-expanded="true"] .opened {
			display: none;
		}
		::ng-deep [aria-expanded="true"] .closed,
		::ng-deep .opened {
			display: inline;
		}
	`]
})
export class FilterBoxSampleComponent {
	material: boolean;
	isMenuOpen = false;
	color = 'black';
	cleared = 0;
	changed = 0;
	patterns: string[] = [undefined, undefined, undefined, undefined, undefined, undefined];
	placeholder: string;
	prepend = false;
	append = false;
	items: string[] = [
		'Jani',
		'Carl',
		'Margareth',
		'Hege',
		'Joe',
		'Gustav',
		'Birgit',
		'Mary',
		'Kai'
	];

	constructor(theme: ThemeService) {
		theme.theme$.subscribe(() => {
			this.material = theme.isMaterial();
		});
	}

	toggleColor(color: string): void {
		this.color = this.color === color ? this.color = 'black' : color;
	}

	incrementCleared() {
		this.cleared++;
	}

	incrementChanged() {
		this.changed++;
	}

	toggle(close?: boolean) {
		if (close) {
			this.isMenuOpen = false;
		} else {
			this.isMenuOpen = !this.isMenuOpen;
		}
	}
}
