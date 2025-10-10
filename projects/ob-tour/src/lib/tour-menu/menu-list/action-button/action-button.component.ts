import {Component, inject, input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ObButtonModule} from '@oblique/oblique';
import {TranslatePipe} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObtTourService} from '../../../services/tour.service';
import {ObMenuActionIcon, ObTourAction} from '../../../models/tour-config.model';

@Component({
	selector: 'obt-action-button',
	imports: [MatButton, MatIcon, MatTooltipModule, ObButtonModule, TranslatePipe],
	templateUrl: './action-button.component.html'
})
export class ActionButtonComponent {
	readonly id = input<string>('');
	readonly name = input<ObTourAction>('start');
	readonly tourTitle = input<string>('');
	readonly icon = input<ObMenuActionIcon>('chevron_right');

	private readonly tourService = inject(ObtTourService);

	onAction(): void {
		this.tourService.startTour(this.tourTitle());
	}
}
