import {Component, HostListener, Injector, ViewChild, effect, inject, input, output, signal} from '@angular/core';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {
	BADGE_TYPES,
	CLOSE_POPOVER_TOUR_ACTIONS,
	ObtBadgePosition,
	ObtBadgeState,
	ObtMenuPositionsX,
	ObtMenuPositionsY,
	ObtTMenuPositionsX,
	ObtTMenuPositionsY,
	ObtTour,
	ObtTourAction,
	ObtTourChange,
	ObtToursConfig
} from '../models/tour.model';
import {ObtTourService} from '../services/tour.service';
import {TranslatePipe} from '@ngx-translate/core';
import {ObButtonModule} from '@oblique/oblique';
import {TourPopoverComponent} from './tour-popover/tour-popover.component';
import {CdkOverlayOrigin, ConnectedPosition, OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {ObtTourOverlayService} from '../services/tour-overlay.service';
import {NgClass} from '@angular/common';
import {ObtTourMenuVisibility} from '../services/tour-menu-visibility.service';

@Component({
	selector: 'obt-tour',
	imports: [
		ObButtonModule,
		MatButtonModule,
		MatMenuModule,
		MatIconModule,
		MatTooltipModule,
		MatSlideToggleModule,
		TranslatePipe,
		TourPopoverComponent,
		OverlayModule,
		PortalModule,
		NgClass
	],
	providers: [ObtTourService],
	templateUrl: './tour.component.html',
	styleUrls: ['./tour.component.scss']
})
export class ObtTourComponent {
	toursConfig = input.required<ObtToursConfig>();
	tourMenuKey = input.required<string>();
	badgePosition = input<ObtBadgePosition>('right');
	positionY = input<ObtTMenuPositionsY>(ObtMenuPositionsY.AUTO);
	positionX = input<ObtTMenuPositionsX>(ObtMenuPositionsX.AUTO);
	customButtonLabel = input<string>('');

	readonly isOpen = signal(false);
	readonly menuPositions = signal<ConnectedPosition[]>([]);
	readonly allTours = signal<ObtTour[]>([]);
	readonly doneTours = signal<ObtTour[]>([]);
	readonly newTours = signal<ObtTour[]>([]);
	readonly inProgressTours = signal<ObtTour[]>([]);
	readonly skippedTours = signal<ObtTour[]>([]);
	showTourMenu: boolean | null = null;

	readonly resetLists = output();

	@ViewChild(CdkOverlayOrigin, {static: false}) overlayOrigin?: CdkOverlayOrigin;

	readonly tourStatusChanged = output<ObtTourChange>();
	protected readonly BADGE_TYPES = BADGE_TYPES;
	private readonly toursService = inject(ObtTourService);
	private readonly injector = inject(Injector);
	private readonly tourOverlayService = inject(ObtTourOverlayService);

	private readonly tourMenuVisibilityService = inject(ObtTourMenuVisibility);
	constructor() {
		this.isOpen.set(false);
		effect(() => {
			this.toursService.menuKey = this.tourMenuKey();
			const config = this.toursConfig();
			this.setupStores(this.toursService.menuKey);
			this.setupToursConfig(config);
		});
		effect(() => {
			const visibility = this.showTourMenu;
			this.tourMenuVisibilityService.changeVisibility(this.tourMenuKey(), visibility);
		});
		effect(() => {
			const step = this.toursService.activeStep();
			const key = this.toursService.activeTourKey();
			if (step && key) {
				this.tourOverlayService.closeOverlay();
				void this.tourOverlayService.openOverlayForStep(step, this.injector);
				return;
			}
			this.tourOverlayService.closeOverlay();
		});
		this.tourStatusChanged.subscribe(tourAction => {
			this.handleTourActions(tourAction.obtTourAction, tourAction.obtTourKey);
			if (CLOSE_POPOVER_TOUR_ACTIONS.includes(tourAction.obtTourAction)) {
				this.isOpen.set(false);
			}
		});
	}

	@HostListener('document:keyup.escape', ['$event'])
	onEscape(event: KeyboardEvent): void {
		event.preventDefault();
		this.closePopover();
	}

	dasherizeBadgeState(state: ObtBadgeState): string {
		return state === 'inProgress' ? 'in-progress' : 'new';
	}

	onToggleChange(event: MatSlideToggleChange): void {
		this.showTourMenu = event.checked;
		this.showTourMenu = this.tourMenuVisibilityService.changeVisibility(this.tourMenuKey(), this.showTourMenu);
		if (event.checked) {
			this.toursService.update(this.toursService.config());
		}
	}

	togglePopover(event: MouseEvent): void {
		event.stopPropagation();
		this.updateOverlayPosition();
		this.isOpen.update(value => !value);
	}

	closePopover(): void {
		if (this.isOpen()) {
			this.isOpen.set(false);
			this.tourOverlayService.closeOverlay();
		}
	}

	getBadgeCounter(state: string): number {
		return state === 'new' ? (this.newTours()?.length ?? 0) : (this.inProgressTours()?.length ?? 0);
	}

	getTooltipKey(state: ObtBadgeState): string {
		const count = this.getBadgeCounter(state);
		const suffix = count <= 1 ? 'one' : 'other';
		return `i18n.ob-tour.tour-menu.button.badge.screen-reader.${this.dasherizeBadgeState(state)}.${suffix}`;
	}

	getScreenReaderBadgeKey(state: ObtBadgeState): string {
		const count = this.getBadgeCounter(state);
		const suffix = count <= 1 ? 'one' : 'other';
		return `i18n.ob-tour.tour-menu.button.badge.screen-reader.${this.dasherizeBadgeState(state)}.${suffix}`;
	}

	clear(): void {
		this.toursService.clearLocalStorage();
		this.resetLists.emit();
	}

	private updateOverlayPosition(): void {
		if (!this.overlayOrigin) {
			return;
		}
		const rect = this.overlayOrigin.elementRef.nativeElement.getBoundingClientRect();
		const placeAbove = this.resolveVerticalPosition(rect);
		const horizontalAnchor = this.resolveHorizontalMenuPosition(rect);
		const offsetY = placeAbove ? -1 : 1;
		const basePosition = this.createBaseMenuPosition(placeAbove, horizontalAnchor, offsetY);
		this.menuPositions.set([
			basePosition,
			this.createFlippedStepOverlayPosition(basePosition),
			this.createCenteredStepOverlayPosition(basePosition)
		]);
	}

	private resolveVerticalPosition(rect: DOMRect): boolean {
		if (this.positionY() === ObtMenuPositionsY.ABOVE) {
			return true;
		}
		if (this.positionY() === ObtMenuPositionsY.BELOW) {
			return false;
		}
		return rect.top > window.innerHeight / 2;
	}

	private resolveHorizontalMenuPosition(rect: DOMRect): 'start' | 'end' {
		if (this.positionX() === ObtMenuPositionsX.START) {
			return 'start';
		}
		if (this.positionX() === ObtMenuPositionsX.END) {
			return 'end';
		}

		const originCenterX = rect.left + rect.width / 2;
		return originCenterX <= window.innerWidth / 2 ? 'start' : 'end';
	}

	private createBaseMenuPosition(placeAbove: boolean, horizontalAnchor: 'start' | 'end', offsetY: number): ConnectedPosition {
		return {
			originX: horizontalAnchor,
			originY: placeAbove ? 'top' : 'bottom',
			overlayX: horizontalAnchor,
			overlayY: placeAbove ? 'bottom' : 'top',
			offsetY
		};
	}

	private createFlippedStepOverlayPosition(base: ConnectedPosition): ConnectedPosition {
		return {
			...base,
			originX: base.originX === 'start' ? 'end' : 'start',
			overlayX: base.overlayX === 'start' ? 'end' : 'start'
		};
	}
	private createCenteredStepOverlayPosition(base: ConnectedPosition): ConnectedPosition {
		return {
			originX: 'center',
			overlayX: 'center',
			originY: base.originY,
			overlayY: base.overlayY,
			offsetY: base.offsetY
		};
	}

	private updateTours(config: ObtTour[]): void {
		this.newTours.set([...config.filter(tour => tour.state === 'new' || null)]);
		this.doneTours.set([...config.filter(tour => tour.state === 'done')]);
		this.inProgressTours.set([...config.filter(tour => tour.state === 'inProgress')]);
		this.skippedTours.set([...config.filter(tour => tour.state === 'skipped')]);
	}

	private handleTourActions(action: ObtTourAction, tourKey: string): void {
		switch (action) {
			case 'skip': {
				this.toursService.skipTour(tourKey);
				break;
			}
			case 'restart': {
				this.toursService.restartTour(tourKey);
				break;
			}
			case 'resume': {
				this.toursService.resumeIfPossible(tourKey);
				break;
			}
			case 'start': {
				this.toursService.startTour(tourKey);
				break;
			}
			default: {
				break;
			}
		}
	}
	private setupStores(key: string): void {
		this.showTourMenu = this.tourMenuVisibilityService.isVisible(key) ?? true;
	}

	private setupToursConfig(config: ObtToursConfig): void {
		this.updateOverlayPosition();
		if (config?.tours?.length) {
			this.toursService.update(config.tours);
		}
		const tours = this.toursService.config();
		this.allTours.set(tours);
		this.updateTours(tours);
	}
}
