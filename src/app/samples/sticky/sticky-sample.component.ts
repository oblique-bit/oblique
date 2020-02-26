import {Component} from '@angular/core';

@Component({
	selector: 'ob-sticky-sample',
	templateUrl: './sticky-sample.component.html'
})
export class ObStickySampleComponent {
	stickyHeader = true;
	stickyFooter = true;
	noLayout = false;
	footerSize = 'md';
	headerSize = 'md';
	sizes: {num: string, name: string}[] = [
		{num: 'lg', name: 'Large'},
		{num: 'md', name: 'Default'},
		{num: 'sm', name: 'Small'}
	];
}
