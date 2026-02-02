import {
	AfterContentChecked,
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
	ViewEncapsulation,
	inject,
} from '@angular/core';
import {Subject, filter, fromEvent, merge, tap} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export const OBLIQUE_COLLAPSE_ACTIVE = new InjectionToken<boolean>('OBLIQUE_COLLAPSE_STATUS');
export const OBLIQUE_COLLAPSE_ICON_POSITION = new InjectionToken<'left' | 'right' | 'justified' | 'none'>(
	'The default icon position'
);
export const OBLIQUE_COLLAPSE_DURATION = new InjectionToken<'slow' | 'fast' | number>('The default animation speed');

@Component({
	selector: 'ob-collapse',
	imports: [MatIconModule],
	templateUrl: './collapse.component.html',
	styleUrls: ['./collapse.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-collapse'},
	exportAs: 'obCollapse',
})
export class ObCollapseComponent implements AfterViewInit, OnDestroy, AfterContentChecked {
	static index = 0;
	contentHeight = 0;
	@ViewChild('collapseForToggle') collapseToggle: ElementRef<HTMLDivElement>;
	@ViewChild('collapseContent') collapseContent!: ElementRef<HTMLDivElement>;
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

		inject(ObGlobalEventsService)
			.resize$.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this.updateContentHeight(); // here
			});
	}

	ngAfterContentChecked(): void {
		this.updateContentHeight();
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

	private updateContentHeight(): void {
		// collapseContent always has 1 child, because that's the content being projected. We actually need the scrollHeight of
		// the projected content, not its wrapper
		const scrollHeight = this.collapseContent?.nativeElement?.querySelector(':first-child')?.scrollHeight ?? 0;
		const height = this.isActive ? scrollHeight : 0;
		if (this.contentHeight !== height) {
			this.contentHeight = height;
		}
	}
}
