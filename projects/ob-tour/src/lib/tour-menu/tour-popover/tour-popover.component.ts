import {Component, EventEmitter, HostListener, Output, effect, inject, input} from '@angular/core';
import {MenuListComponent} from '../menu-list/menu-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {A11yModule} from '@angular/cdk/a11y';
import {MatSuffix} from '@angular/material/form-field';
import {ObButtonModule, ObTranslateParamsPipe} from '@oblique/oblique';

import {ObtTourService} from '../../services/tour.service';
import {ObTourConfig} from '../../models/tour-config.model';

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
		ObTranslateParamsPipe
	],
	templateUrl: './tour-popover.component.html',
	styleUrl: './tour-popover.component.scss'
})
export class TourPopoverComponent {
	readonly doneTours = input<ObTourConfig[]>([]);
	readonly newTours = input<ObTourConfig[]>([]);
	readonly inProgressTours = input<ObTourConfig[]>([]);
	readonly isOpen = input<boolean>(false);

	@Output() readonly closeEmitter: EventEmitter<void> = new EventEmitter<void>();

	private readonly tourService = inject(ObtTourService);

	constructor() {
		effect(() => {
			const currentTour = this.tourService.activeTour();
			if (currentTour?.tourTitle && this.isOpen()) {
				this.onClose();
			}
		});
	}

	onClose(): void {
		const currentTour = this.tourService.activeTour();
		if (!currentTour) {
			return;
		}
		this.closeEmitter.emit();
	}

	@HostListener('document:keyup.escape', ['$event'])
	onEscape(event: KeyboardEvent): void {
		if (this.isOpen()) {
			event.preventDefault();
			this.onClose();
		}
	}
}
