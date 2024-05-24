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
import {Subject, filter, fromEvent, merge, tap} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {animations} from './collapse.component.animations';

export const OBLIQUE_COLLAPSE_ACTIVE = new InjectionToken<boolean>('OBLIQUE_COLLAPSE_STATUS');
export const OBLIQUE_COLLAPSE_ICON_POSITION = new InjectionToken<'left' | 'right' | 'justified' | 'none'>('The default icon position');
export const OBLIQUE_COLLAPSE_DURATION = new InjectionToken<'slow' | 'fast' | number>('The default animation speed');

@Component({
	selector: 'ob-collapse',
	exportAs: 'obCollapse',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './collapse.component.html',
	styleUrls: ['./collapse.component.scss'],
	animations: [animations],
	host: {class: 'ob-collapse'},
	standalone: true,
	imports: [NgIf, MatIconModule]
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
		@Optional() @Inject(OBLIQUE_COLLAPSE_ICON_POSITION) iconPos: 'left' | 'right' | 'justified' | 'none',
		@Optional() @Inject(OBLIQUE_COLLAPSE_DURATION) animationSpeed: 'slow' | 'fast' | number
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
