import {Component} from '@angular/core';

@Component({
	selector: 'or-sticky-sample',
	templateUrl: './sticky-sample.component.html'
})
export class StickySampleComponent {
	stickyHeader = true;
	stickyFooter = true;
	footerSize = 'md';
	headerSize = 'md';
	sizes: {num: string, name: string}[] = [
		{num: 'lg', name: 'Large'},
		{num: 'md', name: 'Default'},
		{num: 'sm', name: 'Small'}
	];
}
