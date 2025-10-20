import {Component, effect, input, output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ObButtonModule} from '@oblique/oblique';
import {TranslatePipe} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObtMenuActionIcon, ObtTourAction} from '../../../models/tour.model';

@Component({
	selector: 'obt-action-button',
	imports: [MatIcon, MatTooltipModule, ObButtonModule, TranslatePipe, MatIconButton],
	templateUrl: './action-button.component.html'
})
export class ActionButtonComponent {
	readonly actionName = input.required<ObtTourAction>();
	readonly activeTourKey = input.required<string>();
	readonly tourTitle = input.required<string>();
	readonly icon = input.required<ObtMenuActionIcon>();
	readonly id = input.required<string>();

	readonly tourStatusChanged = output<{obtTourAction: ObtTourAction; obtTourKey: string}>();
	private currentTourKey = '';
	constructor() {
		effect(() => {
			this.currentTourKey = this.activeTourKey();
		});
	}

	onAction(action: ObtTourAction): void {
		switch (action) {
			case 'start':
				this.tourStatusChanged.emit({obtTourAction: 'start', obtTourKey: this.currentTourKey});
				break;
			case 'skip':
				this.tourStatusChanged.emit({obtTourAction: 'skip', obtTourKey: this.currentTourKey});
				break;
			case 'restart':
				this.tourStatusChanged.emit({obtTourAction: 'restart', obtTourKey: this.currentTourKey});
				break;
			case 'resume':
				this.tourStatusChanged.emit({obtTourAction: 'resume', obtTourKey: this.currentTourKey});
				break;
			default:
				break;
		}
	}
}
