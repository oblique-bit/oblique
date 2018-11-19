import {Component, Pipe, PipeTransform} from '@angular/core';

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
export class FilterBoxSampleComponent  {
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

	toggleColor(color: string): void {
		this.color = this.color === color ? this.color = 'black' : color;
	}

	incrementCleared() {
		this.cleared++;
	}

	incrementChanged() {
		this.changed++;
	}
}
