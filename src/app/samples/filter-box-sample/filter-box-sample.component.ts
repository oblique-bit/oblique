import {Component, Pipe, PipeTransform} from '@angular/core';
import {MasterLayoutService, MaterialService} from 'oblique-reactive';

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
	`]
})
export class FilterBoxSampleComponent {
	material: boolean;
	isMenuOpen = false;
	color = 'black';
	cleared = 0;
	changed = 0;
	patterns: string[] = [undefined, undefined, undefined, undefined, undefined, undefined];
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

	constructor(private masterLayout: MasterLayoutService, materialService: MaterialService) {
		this.material = materialService.enabled;
		materialService.toggled.subscribe(enabled => {
			this.material = enabled;
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
