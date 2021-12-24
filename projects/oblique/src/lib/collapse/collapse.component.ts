import {Component, EventEmitter, Inject, InjectionToken, Input, Optional, Output, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export const OBLIQUE_COLLAPSE_ACTIVE = new InjectionToken<boolean>('OBLIQUE_COLLAPSE_STATUS');
export const OBLIQUE_COLLAPSE_ICON_POSITION = new InjectionToken<'left' | 'right' | 'justified' | 'none'>('The default icon position');
export const OBLIQUE_COLLAPSE_DURATION = new InjectionToken<'slow' | 'fast' | number>('The default animation speed');

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
	host: {class: 'ob-collapse'}
})
export class ObCollapseComponent {
	time: number;
	@Input() iconPosition: 'left' | 'right' | 'justified' | 'none' = 'left';
	@Output() readonly activeChange = new EventEmitter<boolean>();

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

	constructor(
		@Optional() @Inject(OBLIQUE_COLLAPSE_ACTIVE) private isActive: boolean,
		@Optional() @Inject(OBLIQUE_COLLAPSE_ICON_POSITION) iconPos: any, // NOTE, the real type will throw an error during build, should be fixed with Ivy
		@Optional() @Inject(OBLIQUE_COLLAPSE_DURATION) animationSpeed: any // NOTE, the real type will throw an error during build, should be fixed with Ivy
	) {
		this.isActive = !!this.isActive;
		this.iconPosition = iconPos ?? this.iconPosition;
		this.time = ObCollapseComponent.getDuration(animationSpeed || 'slow');
	}

	private static getDuration(duration: 'slow' | 'fast' | number): number {
		switch (duration) {
			case 'slow':
				return 600;
			case 'fast':
				return 250;
			default:
				return duration;
		}
	}
}
