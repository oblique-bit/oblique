import {Directive, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {ObTColumnState} from './column-layout.model';

@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel',
	host: {class: 'ob-column-panel'},
	standalone: false
})
export class ObColumnPanelDirective implements OnInit {
	@Input() initialState: ObTColumnState;
	@HostBinding('class.ob-collapsed') public collapsed = false;
	@Output() readonly toggled = new EventEmitter<boolean>();

	ngOnInit(): void {
		this.collapsed = this.initialState === 'CLOSED';
	}

	toggle(): void {
		this.collapsed = !this.collapsed;
		this.toggled.emit(this.collapsed);
	}
}
