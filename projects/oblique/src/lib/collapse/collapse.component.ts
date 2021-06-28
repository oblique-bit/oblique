import {Component, EventEmitter, Inject, InjectionToken, Input, Optional, Output, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export const OBLIQUE_COLLAPSE_ACTIVE = new InjectionToken<boolean>('OBLIQUE_COLLAPSE_STATUS');

@Component({
	selector: 'ob-collapse',
	exportAs: 'obCollapse',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './collapse.component.html',
	styleUrls: ['./collapse.component.scss'],
	animations: [
		trigger('expandCollapse', [
			state(
				'open',
				style({
					height: '*'
				})
			),
			state(
				'close',
				style({
					height: 0
				})
			),
			transition('open <=> close', animate('{{ time }}ms ease-in-out'))
		])
	],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-collapse'}
})
export class ObCollapseComponent {
	time = ObCollapseComponent.getDuration('slow');
	@Input() iconPosition: 'left' | 'right' | 'justified' | 'none' = 'left';
	@Output() activeChange = new EventEmitter<boolean>();

	get active() {
		return this.isActive;
	}

	@Input() set active(active: boolean) {
		this.isActive = active;
		this.activeChange.emit(active);
	}

	@Input() set duration(duration: 'slow' | 'fast' | number) {
		this.time = ObCollapseComponent.getDuration(duration || 'slow');
	}

	constructor(@Optional() @Inject(OBLIQUE_COLLAPSE_ACTIVE) private isActive: boolean) {
		this.isActive = !!this.isActive;
	}

	private static getDuration(duration: 'slow' | 'fast' | number): number {
		switch (duration) {
			case 'slow':
				return 600;
			case 'fast':
				return 250;
			default:
				return duration as number;
		}
	}
}
