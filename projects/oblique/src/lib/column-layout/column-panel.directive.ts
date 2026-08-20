import {Directive, OnInit, input, output} from '@angular/core';
import {ObTColumnState} from './column-layout.model';

@Directive({
	selector: '[obColumnPanel]',
	host: {
		class: 'ob-column-panel',
		'[class.ob-collapsed]': 'collapsed',
	},
	exportAs: 'obColumnPanel',
})
export class ObColumnPanelDirective implements OnInit {
	readonly initialState = input<ObTColumnState>(undefined);
	public collapsed = this.initialState() === 'CLOSED';
	readonly toggled = output<boolean>();

	ngOnInit(): void {
		this.collapsed = this.initialState() === 'CLOSED';
	}

	toggle(): void {
		this.collapsed = !this.collapsed;
		this.toggled.emit(this.collapsed);
	}
}
