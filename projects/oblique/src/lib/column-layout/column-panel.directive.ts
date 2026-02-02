import {Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObTColumnState} from './column-layout.model';

@Directive({
	selector: '[obColumnPanel]',
	standalone: false,
	host: {
		class: 'ob-column-panel',
		'[class.ob-collapsed]': 'collapsed',
	},
	exportAs: 'obColumnPanel',
})
export class ObColumnPanelDirective implements OnInit {
	@Input() initialState: ObTColumnState;
	public collapsed = false;
	@Output() readonly toggled = new EventEmitter<boolean>();

	ngOnInit(): void {
		this.collapsed = this.initialState === 'CLOSED';
	}

	toggle(): void {
		this.collapsed = !this.collapsed;
		this.toggled.emit(this.collapsed);
	}
}
