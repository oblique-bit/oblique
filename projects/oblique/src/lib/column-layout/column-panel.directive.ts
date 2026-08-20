import {Directive, OnInit, input, model} from '@angular/core';
import {ObTColumnState} from './column-layout.model';

@Directive({
	selector: '[obColumnPanel]',
	host: {
		class: 'ob-column-panel',
		'[class.ob-collapsed]': 'collapsed()',
	},
	exportAs: 'obColumnPanel',
})
export class ObColumnPanelDirective implements OnInit {
	readonly initialState = input<ObTColumnState>();
	readonly collapsed = model(true);

	ngOnInit(): void {
		this.collapsed.set(this.initialState() === 'CLOSED');
	}

	toggle(): void {
		this.collapsed.update(state => !state);
	}
}
