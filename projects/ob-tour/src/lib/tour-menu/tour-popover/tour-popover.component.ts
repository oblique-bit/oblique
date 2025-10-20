import {Component, HostListener, effect, inject, input, output} from '@angular/core';
import {MenuListComponent} from '../menu-list/menu-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {A11yModule} from '@angular/cdk/a11y';
import {MatSuffix} from '@angular/material/form-field';
import {ObButtonModule, ObTranslateParamsPipe} from '@oblique/oblique';

import {ObtTourService} from '../../services/tour.service';
import {ObtTour, ObtTourChange} from '../../models/tour.model';
import {TitleCasePipe} from '@angular/common';

@Component({
	selector: 'obt-tour-popover',
	imports: [
		MenuListComponent,
		MatButtonModule,
		ObButtonModule,
		MatIconModule,
		MatTooltipModule,
		TranslatePipe,
		A11yModule,
		MatSuffix,
		ObTranslateParamsPipe,
		TitleCasePipe
	],
	templateUrl: './tour-popover.component.html',
	styleUrl: './tour-popover.component.scss'
})
export class TourPopoverComponent {
	readonly doneTours = input<ObtTour[]>([]);
	readonly skippedTours = input<ObtTour[]>([]);
	readonly newTours = input<ObtTour[]>([]);
	readonly inProgressTours = input<ObtTour[]>([]);
	readonly isOpen = input<boolean>(false);

	readonly closed = output();
	readonly cleared = output();
	readonly tourStatusChanged = output<ObtTourChange>();

	private readonly tourService = inject(ObtTourService);

	constructor() {
		effect(() => {
			const open = this.isOpen();
			if (!open) {
				this.onClose();
			}
		});
	}

	@HostListener('document:keyup.escape', ['$event'])
	onEscape(event: KeyboardEvent): void {
		if (this.isOpen()) {
			event.preventDefault();
			this.onClose();
		}
	}

	onClose(): void {
		const currentTour = this.tourService.activeTour();
		if (!currentTour) {
			return;
		}
		this.closed.emit();
	}

	clearTours(): void {
		this.tourService.clearLocalStorage();
		this.cleared.emit();
		this.closed.emit();
	}
}
