import {Component, HostListener, ViewChild, effect, inject, input, signal} from '@angular/core';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {ObTourConfig, ObtBadgePosition, ObtMenuPositionsX, ObtMenuPositionsY, ObtToursConfig} from '../models/tour-config.model';
import {ObtTourService} from '../services/tour.service';
import {TranslatePipe} from '@ngx-translate/core';
import {ObButtonModule} from '@oblique/oblique';
import {TourPopoverComponent} from './tour-popover/tour-popover.component';
import {CdkOverlayOrigin, ConnectedPosition, OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {ObtTourOverlayService} from '../services/tour-overlay.service';
import {NgClass} from '@angular/common';

@Component({
	selector: 'obt-tour-menu',
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
	templateUrl: './tour-menu.component.html',
	styleUrls: ['./tour-menu.component.scss']
})
export class ObtTourMenuComponent {
	toursConfig = input<ObtToursConfig>({tours: []});
	badgePosition = input<ObtBadgePosition>('right');
	positionY = input<ObtMenuPositionsY>(ObtMenuPositionsY.AUTO);
	positionX = input<ObtMenuPositionsX>(ObtMenuPositionsX.AUTO);
	customButtonLabel = input<string>('');

	readonly allTours = signal<ObTourConfig[]>([]);
	readonly showTours = signal<boolean>(true);
	readonly doneTours = signal<ObTourConfig[]>([]);
	readonly newTours = signal<ObTourConfig[]>([]);
	readonly inProgressTours = signal<ObTourConfig[]>([]);
	isOpen = signal(false);
	menuPositions = signal<ConnectedPosition[]>([]);

	@ViewChild(CdkOverlayOrigin, {static: false}) overlayOrigin?: CdkOverlayOrigin;

	private readonly toursService = inject(ObtTourService);
	private readonly overlay = inject(ObtTourOverlayService); //this is needed to load the overlay first. Otherwise, the overlay panel for the tours doesn't open

	constructor() {
		effect(() => {
			const config = this.toursConfig();
			this.toursService.init(config?.tours ?? []);
			this.updateTours(config ?? {tours: []});
			this.updateOverlayPosition();
		});
	}

	@HostListener('document:keyup.escape', ['$event'])
	onEscape(event: KeyboardEvent): void {
		event.preventDefault();
		this.closePopover();
	}

	dasherize(state: string): string {
		return state === 'inProgress' ? 'in-progress' : 'new';
	}

	onToggleChange(event: MatSlideToggleChange): void {
		this.showTours.set(event.checked);
		if (event.checked) {
			this.toursService.updateConfig.subscribe(config => this.allTours.set(config));
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
			queueMicrotask(() => {
				const popover = document.querySelector('.cdk-overlay-container obt-tour-popover');
				popover?.remove();
			});
		}
	}

	getTours(state: string): any[] {
		return state === 'new' ? this.newTours() : this.inProgressTours();
	}

	getTooltipKey(state: string): string {
		const count = this.getTours(state).length;
		const suffix = count <= 1 ? 'one' : 'other';
		return `i18n.ob-tour.tour-menu.button.badge.screen-reader.${this.dasherize(state)}.${suffix}`;
	}

	getScreenReaderKey(state: string): string {
		const count = this.getTours(state).length;
		const suffix = count <= 1 ? 'one' : 'other';
		return `i18n.ob-tour.tour-menu.button.badge.screen-reader.${this.dasherize(state)}.${suffix}`;
	}
	private updateOverlayPosition(): void {
		if (!this.overlayOrigin) {
			return;
		}

		const rect = this.overlayOrigin.elementRef.nativeElement.getBoundingClientRect();

		const placeAbove = this.resolveVerticalPosition(rect);
		const horizontalAnchor = this.resolveHorizontalPosition(rect);

		const offsetY = placeAbove ? -1 : 1;
		const basePosition = this.createBasePosition(placeAbove, horizontalAnchor, offsetY);

		this.menuPositions.set([basePosition, this.createFlippedPosition(basePosition), this.createCenteredPosition(basePosition)]);
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

	private resolveHorizontalPosition(rect: DOMRect): 'start' | 'end' {
		if (this.positionX() === ObtMenuPositionsX.START) {
			return 'start';
		}
		if (this.positionX() === ObtMenuPositionsX.END) {
			return 'end';
		}

		const originCenterX = rect.left + rect.width / 2;
		return originCenterX <= window.innerWidth / 2 ? 'start' : 'end';
	}

	private createBasePosition(placeAbove: boolean, horizontalAnchor: 'start' | 'end', offsetY: number): ConnectedPosition {
		return {
			originX: horizontalAnchor,
			originY: placeAbove ? 'top' : 'bottom',
			overlayX: horizontalAnchor,
			overlayY: placeAbove ? 'bottom' : 'top',
			offsetY
		};
	}

	private createFlippedPosition(base: ConnectedPosition): ConnectedPosition {
		return {
			...base,
			originX: base.originX === 'start' ? 'end' : 'start',
			overlayX: base.overlayX === 'start' ? 'end' : 'start'
		};
	}

	private createCenteredPosition(base: ConnectedPosition): ConnectedPosition {
		return {
			originX: 'center',
			overlayX: 'center',
			originY: base.originY,
			overlayY: base.overlayY,
			offsetY: base.offsetY
		};
	}
	private updateTours(config: ObtToursConfig): void {
		const tours = config.tours ?? [];
		this.allTours.set(tours);
		this.doneTours.set(tours.filter(tour => tour.state === 'done'));
		this.inProgressTours.set(tours.filter(tour => tour.state === 'inProgress'));
		this.newTours.set(tours.filter(tour => tour.state === 'new'));
	}
}
