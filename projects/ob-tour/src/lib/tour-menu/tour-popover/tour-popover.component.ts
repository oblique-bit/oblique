import {Component, EventEmitter, HostListener, Output, input} from '@angular/core';
import {MenuListComponent} from '../menu-list/menu-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {A11yModule} from '@angular/cdk/a11y';
import {MatSuffix} from '@angular/material/form-field';
import {ObButtonModule, ObTranslateParamsPipe} from '@oblique/oblique';
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

	onClose(): void {
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
