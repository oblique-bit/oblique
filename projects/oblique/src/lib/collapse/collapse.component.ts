import {Component, EventEmitter, Inject, InjectionToken, Input, OnChanges, Optional, Output, ViewEncapsulation} from '@angular/core';
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
					height: 0,
					overflow: 'hidden'
				})
			),
			transition('open <=> close', animate('{{ time }}ms ease-in-out'))
		])
	]
})
export class ObCollapseComponent implements OnChanges {
	@Input() set active(active: boolean) {
		this.isActive = active;
		this.activeChange.emit(active);
	}

	get active() {
		return this.isActive;
	}

	@Input() duration: 'slow' | 'fast' | number = 'slow';
	time: number;
	@Input() iconPosition: 'left' | 'right' | 'justified' = 'left';
	@Input() direction:
		| 'down-up'
		| 'down-right'
		| 'down-left'
		| 'up-down'
		| 'up-right'
		| 'up-left'
		| 'right-left'
		| 'right-up'
		| 'right-down'
		| 'left-right'
		| 'left-up'
		| 'left-down' = 'down-up';
	@Output() activeChange = new EventEmitter<boolean>();

	constructor(@Optional() @Inject(OBLIQUE_COLLAPSE_ACTIVE) private isActive: boolean) {
		this.isActive = !!this.isActive;
	}

	ngOnChanges() {
		this.time = ObCollapseComponent.getDuration(this.duration);
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
