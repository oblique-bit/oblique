import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	InjectionToken,
	OnDestroy,
	ViewEncapsulation,
	afterRenderEffect,
	computed,
	inject,
	input,
	model,
	signal,
	viewChild,
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-collapse'},
	exportAs: 'obCollapse',
})
export class ObCollapseComponent implements AfterViewInit, OnDestroy {
	static index = 0;
	readonly contentHeight = signal(0);
	readonly collapseToggle = viewChild.required<ElementRef<HTMLDivElement>>('collapseForToggle');
	readonly collapseContent = viewChild.required<ElementRef<HTMLDivElement>>('collapseContent');
	readonly id = input(`collapse-${ObCollapseComponent.index}`);
	readonly iconPosition = input<'left' | 'right' | 'justified' | 'none'>(
		inject(OBLIQUE_COLLAPSE_ICON_POSITION, {optional: true}) ?? 'left'
	);
	readonly active = model<boolean>(!!inject(OBLIQUE_COLLAPSE_ACTIVE, {optional: true}));
	readonly duration = input<'slow' | 'fast' | number | null>(inject(OBLIQUE_COLLAPSE_DURATION, {optional: true}));
	readonly time = computed(() => ObCollapseComponent.getDuration(this.duration() || 'slow'));
	private readonly unsubscribe = new Subject<void>();

	constructor() {
		ObCollapseComponent.index++;

		afterRenderEffect({
			earlyRead: () => {
				return this.getContentHeight();
			},
			write: heightSignal => {
				this.contentHeight.set(heightSignal());
			},
		});

		inject(ObGlobalEventsService)
			.resize$.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this.updateContentHeight();
			});
	}

	ngAfterViewInit(): void {
		merge(
			fromEvent<KeyboardEvent>(this.collapseToggle().nativeElement, 'keyup').pipe(
				filter(event => event.key === 'Enter')
			),
			fromEvent<KeyboardEvent>(this.collapseToggle().nativeElement, 'keydown').pipe(
				filter(event => event.code === 'Space'),
				tap(event => event.preventDefault()),
				filter(event => !event.repeat)
			)
		)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => {
				this.toggleActive();
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	toggleActive(): void {
		this.active.update(active => !active);
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
		const height = this.getContentHeight();
		if (this.contentHeight() !== height) {
			this.contentHeight.set(height);
		}
	}

	private getContentHeight(): number {
		// collapseContent always has 1 child, because that's the content being projected. We actually need the scrollHeight of
		// the projected content, not its wrapper
		const scrollHeight =
			this.collapseContent().nativeElement.querySelector<HTMLElement>(':first-child')?.scrollHeight ?? 0;
		return this.active() ? scrollHeight : 0;
	}
}
