import {Component, ElementRef, HostBinding, Input, OnInit, Renderer2} from '@angular/core';
import {ObIAlertType} from './alert.model';

@Component({
	selector: 'ob-alert',
	templateUrl: './alert.component.html',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-alert'}
})
export class ObAlertComponent implements OnInit {
	@HostBinding('class.ob-alert-info') info = true;
	@HostBinding('class.ob-alert-success') success = false;
	@HostBinding('class.ob-alert-warning') warning = false;
	@HostBinding('class.ob-alert-error') error = false;

	get type(): ObIAlertType {
		return this.currentType;
	}

	@Input() set type(type: ObIAlertType) {
		this.currentType = type;
		this.info = type === 'info';
		this.success = type === 'success';
		this.warning = type === 'warning';
		this.error = type === 'error';
	}
	private currentType: ObIAlertType = 'info';

	constructor(private readonly content: ElementRef, private readonly renderer: Renderer2) {}

	ngOnInit(): void {
		this.content.nativeElement.querySelectorAll('a').forEach(anchor => this.renderer.addClass(anchor, 'ob-alert-link'));
	}
}
