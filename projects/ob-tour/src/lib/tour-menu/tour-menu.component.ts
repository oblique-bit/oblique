import {Component, ViewChild, effect, inject, input, signal} from '@angular/core';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {ObTourConfig, ObToursConfig} from '../models/tour-config.model';
import {ObTourService} from '../services/tour.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ObButtonModule} from '@oblique/oblique';
import {TourPopoverComponent} from './tour-popover/tour-popover.component';
import {CdkOverlayOrigin, ConnectedPosition, OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';

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
		PortalModule
	],
	templateUrl: './tour-menu.component.html',
	styleUrls: ['./tour-menu.component.scss']
})
export class TourMenuComponent {
	toursConfig = input<ObToursConfig>({tours: []});

	readonly allTours = signal<ObTourConfig[]>([]);
	readonly showTours = signal<boolean>(true);
	readonly doneTours = signal<ObTourConfig[]>([]);
	readonly newTours = signal<ObTourConfig[]>([]);
	readonly inProgressTours = signal<ObTourConfig[]>([]);
	isOpen = signal(false);

	@ViewChild(CdkOverlayOrigin, {static: false}) overlayOrigin?: CdkOverlayOrigin;

	readonly translation = inject(TranslateService);
	readonly menuPositions: ConnectedPosition[] = [
		{originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
		{originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}
	];

	private readonly toursService = inject(ObTourService);

	constructor() {
		effect(() => {
			const config = this.toursConfig();
			this.toursService.init(config?.tours ?? []);
			if (config) {
				this.toursService.init(config.tours);
				this.updateTours(config);
			} else {
				this.updateTours({tours: []});
			}
		});
	}

	onToggleChange(event: MatSlideToggleChange): void {
		this.showTours.set(event.checked);

		if (event.checked) {
			this.toursService.updateConfig.subscribe(config => this.allTours.set(config));
		}
	}

	togglePopover(event: MouseEvent): void {
		event.stopPropagation();
		this.isOpen.update(value => !value);
	}

	closePopover(): void {
		if (this.isOpen()) {
			this.isOpen.set(false);
		}
	}

	private updateTours(config: ObToursConfig): void {
		this.allTours.set(config.tours);
		const tours = config.tours ?? [];
		this.doneTours.set(tours.filter(tour => tour.state === 'done'));
		this.inProgressTours.set(tours.filter(tour => tour.state === 'inProgress'));
		this.newTours.set(tours.filter(tour => tour.state === 'new'));
	}
}
