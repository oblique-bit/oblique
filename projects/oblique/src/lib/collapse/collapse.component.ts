import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	InjectionToken,
	Input,
	OnDestroy,
	Optional,
	Output,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject, filter, fromEvent, merge, tap} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
export class ObCollapseComponent implements AfterViewInit, OnDestroy {
	static index = 0;
	@ViewChild('collapseForToggle') collapseToggle: ElementRef<HTMLDivElement>;
	@Input() id = `collapse-${ObCollapseComponent.index}`;
	time: number;
	@Input() iconPosition: 'left' | 'right' | 'justified' | 'none' = 'left';
	@Output() readonly activeChange = new EventEmitter<boolean>();
	private readonly unsubscribe = new Subject<void>();

	get active(): boolean {
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
		ObCollapseComponent.index++;
	}

	ngAfterViewInit(): void {
		merge(
			fromEvent<KeyboardEvent>(this.collapseToggle.nativeElement, 'keyup').pipe(filter(event => event.key === 'Enter')),
			fromEvent<KeyboardEvent>(this.collapseToggle.nativeElement, 'keydown').pipe(
				filter(event => event.code === 'Space'),
				tap(event => event.preventDefault()),
				filter(event => !event.repeat)
			)
		)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => {
				this.active = !this.active;
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
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
