import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ObThemeService} from 'oblique';

interface Direction {
	value: string;
	viewValue: string;
}

interface Duration {
	value: 'slow' | 'fast' | number;
	viewValue: string;
}

interface IconPosition {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'ob-collapse-sample',
	templateUrl: './collapse-sample.component.html'
})
export class CollapseSampleComponent {
	collapseTitle = 'Collapse title here ';
	material: Observable<boolean>;
	direction = new FormControl('down-up');
	duration = new FormControl('fast');
	iconPosition = new FormControl('left');
	active = false;

	directions: Direction[] = [
		{value: 'down-up', viewValue: 'default'},
		{value: 'down-right', viewValue: 'Toggle Down-Right'},
		{value: 'down-left', viewValue: 'Toggle Down-Left'},
		{value: 'up-down', viewValue: 'Toggle Up-Down'},
		{value: 'up-right', viewValue: 'Toggle Up-Right'},
		{value: 'up-left', viewValue: 'Toggle Up-Left'},
		{value: 'right-left', viewValue: 'Toggle Right-Left'},
		{value: 'right-down', viewValue: 'Toggle Right-Down'},
		{value: 'right-up', viewValue: 'Toggle Right-Up'},
		{value: 'left-right ', viewValue: 'Toggle Left-Right'},
		{value: 'left-down ', viewValue: 'Toggle Left-Down'},
		{value: 'left-up ', viewValue: 'Toggle Left-Up'}
	];

	durations: Duration[] = [
		{value: 'slow', viewValue: 'Slow'},
		{value: 'fast', viewValue: 'Fast'},
		{value: 100, viewValue: '100 ms'},
		{value: 500, viewValue: '500 ms'},
		{value: 1000, viewValue: '1000 ms'},
		{value: 1500, viewValue: '1500 ms'},
		{value: 2000, viewValue: '2000 ms'}
	];

	iconPositions: IconPosition[] = [
		{value: 'left', viewValue: 'Move the icon to the left'},
		{value: 'right', viewValue: 'Move the icon to the right'},
		{value: 'justified', viewValue: 'Move the icon to the right'}
	];

	constructor(theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
	}
}
