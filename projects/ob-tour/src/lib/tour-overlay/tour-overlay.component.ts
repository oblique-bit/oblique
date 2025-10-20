import {Component, HostListener, effect, inject, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSuffix} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {ObButtonDirective, ObTranslateParamsPipe} from '@oblique/oblique';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {ObtTourService} from '../services/tour.service';
import {ObtArrowDirection, ObtTour} from '../models/tour.model';

@Component({
	selector: 'obt-tour-overlay',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		TranslateModule,
		MatSuffix,
		ObButtonDirective,
		MatTooltip,
		CdkTrapFocus,
		ObTranslateParamsPipe,
		MatProgressBarModule
	],
	templateUrl: './tour-overlay.component.html',
	styleUrls: ['./tour-overlay.component.scss'],
	host: {
		role: 'dialog',
		'aria-modal': 'true',
		'[attr.aria-labelledby]': "'obt-tour-overlay-title'"
	}
})
export class TourOverlayComponent {
	readonly closeEmitter = output();
	readonly arrowPosition = input<ObtArrowDirection>('arrow-none');

	tourStepsLength = 0;
	percent = 0;
	activeStepNumber = 0;
	hasNextIndex = false;
	hasPreviousIndex = false;
	currentTour: ObtTour;
	currentArrowPosition: ObtArrowDirection = 'arrow-none';

	readonly tourService = inject(ObtTourService);

	constructor() {
		effect(() => {
			this.currentTour = this.tourService.activeTour();
			this.tourStepsLength = this.currentTour?.steps?.length ?? 0;
			this.hasNextIndex = this.tourService.hasNextStep();
			this.hasPreviousIndex = this.tourService.hasPreviousStep();
			this.updateState();
		});
		effect(() => {
			this.currentArrowPosition = this.arrowPosition();
		});
	}

	onNext(): void {
		this.tourService.nextStep();
		this.updateState();
		this.closeEmitter.emit();
	}

	onPrev(): void {
		this.tourService.prevStep();
		this.updateState();
		this.closeEmitter.emit();
	}

	onClose(): void {
		if (this.tourService.hasNextStep()) {
			this.tourService.pauseTour();
		} else {
			this.onFinish();
		}
		this.closeEmitter.emit();
	}

	@HostListener('document:keyup.escape', ['$event'])
	onEscape(event: KeyboardEvent): void {
		event.preventDefault();
		this.onClose();
	}

	/** Recalculate current step and progress */
	private updateState(): void {
		if (!this.currentTour) {
			this.resetStep();
			return;
		}
		const idx = this.tourService.activeStepIndex() ?? 0;
		this.activeStepNumber = idx + 1;
		this.tourStepsLength = this.currentTour.steps.length;
		this.hasNextIndex = this.tourService.hasNextStep();
		this.hasPreviousIndex = this.tourService.hasPreviousStep();
		this.percent = this.calcPercent(this.tourStepsLength, this.activeStepNumber);
	}

	private resetStep(): void {
		this.tourStepsLength = 0;
		this.percent = 0;
		this.activeStepNumber = 0;
		this.hasNextIndex = false;
		this.hasPreviousIndex = false;
		this.currentArrowPosition = this.arrowPosition();
	}

	private onFinish(): void {
		this.tourService.finishTour(this.tourService.activeTourKey());
		this.updateState();
	}

	private calcPercent(maxValue: number, currentValue: number): number {
		if (maxValue === 0) {
			return 0;
		}
		return (100 / maxValue) * currentValue;
	}
}
