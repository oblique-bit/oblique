import {ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatSuffix} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {ObButtonDirective, ObTranslateParamsPipe} from '@oblique/oblique';
import {CdkTrapFocus} from '@angular/cdk/a11y';

import {ObtTourService} from '../services/tour.service';
import {ObTourStep} from '../models/tour-step.model';
export type ArrowDirection = 'arrow-top' | 'arrow-bottom' | 'arrow-left' | 'arrow-right' | 'arrow-none';
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
		ObTranslateParamsPipe
	],
	templateUrl: './tour-overlay.component.html',
	styleUrl: './tour-overlay.component.scss',
	host: {
		role: 'dialog',
		'aria-modal': 'true',
		'[attr.aria-labelledby]': "'obt-tour-overlay-title'"
	}
})
export class TourOverlayComponent {
	@Input()
	set arrowPosition(value: ArrowDirection) {
		this.arrowPositionValue = value;
		this.cdr.markForCheck();
	}
	get arrowPosition(): ArrowDirection {
		return this.arrowPositionValue;
	}

	@Output() readonly closeEmitter = new EventEmitter<void>();

	readonly currentStep = computed<ObTourStep | null>(() => this.tourService.currentStep());
	readonly hasNext = computed(() => this.tourService.hasNextStep());
	readonly hasPrev = computed(() => this.tourService.hasPreviousStep());

	private readonly tourService = inject(ObtTourService);
	private arrowPositionValue: ArrowDirection = 'arrow-none';

	constructor(private readonly cdr: ChangeDetectorRef) {}

	onNext(): void {
		this.closeEmitter.emit();
		this.tourService.nextStep();
	}

	onPrev(): void {
		this.closeEmitter.emit();
		this.tourService.prevStep();
	}

	onClose(): void {
		this.closeEmitter.emit();
		this.tourService.finishTour();
	}

	@HostListener('document:keyup.escape', ['$event'])
	onEscape(event: KeyboardEvent): void {
		event.preventDefault();
		this.onClose();
	}
}
