import {Component, type ElementRef, inject, viewChild} from '@angular/core';
import {ObtMenuPositionsX, ObtMenuPositionsY, ObtTourService, type ObtToursConfig} from '@oblique/ob-tour';

@Component({
	selector: 'sb-ob-tour',
	templateUrl: './ob-tour-sample.component.html',
	styleUrl: './ob-tour-sample.component.scss',
	standalone: false
})
export class ObTourSampleComponent {
	readonly chooseTour = viewChild<ElementRef<HTMLElement>>('chooseTour');
	readonly list1 = viewChild<ElementRef<HTMLElement>>('list1');
	readonly list2 = viewChild<ElementRef<HTMLElement>>('list2');
	readonly list3 = viewChild<ElementRef<HTMLElement>>('list3');
	readonly titleElement = viewChild<ElementRef<HTMLElement>>('titleElement');

	tourConfig: ObtToursConfig = {
		tours: [
			{
				tourTitle: 'i18n.ob-tour.rainbow.title',
				tourDescription: 'i18n.ob-tour.rainbow.description',
				storageKey: 'rainbowTourStorageKey',
				triggers: [{type: 'manual'}],
				state: 'new',
				steps: [
					{
						target: {elementRef: this.chooseTour},
						stepTitle: 'i18n.ob-tour.rainbow.step1.title',
						stepDescription: 'i18n.ob-tour.rainbow.step1.description'
					},
					{
						target: {elementRef: this.list1},
						stepTitle: 'i18n.ob-tour.rainbow.step2.title',
						stepDescription: 'i18n.ob-tour.rainbow.step2.description'
					},
					{
						target: {elementRef: this.list2},
						stepTitle: 'i18n.ob-tour.rainbow.step3.title',
						stepDescription: 'i18n.ob-tour.rainbow.step3.description'
					},
					{
						target: {elementRef: this.titleElement},
						stepTitle: 'i18n.ob-tour.rainbow.step3.title',
						stepDescription: 'i18n.ob-tour.rainbow.step3.description'
					},
					{
						target: {elementRef: this.chooseTour},
						stepTitle: 'i18n.ob-tour.rainbow.step1.title',
						stepDescription: 'i18n.ob-tour.rainbow.step1.description'
					},
					{
						target: {elementRef: this.list1},
						stepTitle: 'i18n.ob-tour.rainbow.step2.title',
						stepDescription: 'i18n.ob-tour.rainbow.step2.description'
					},
					{
						target: {elementRef: this.list2},
						stepTitle: 'i18n.ob-tour.rainbow.step3.title',
						stepDescription: 'i18n.ob-tour.rainbow.step3.description'
					},
					{
						target: {elementRef: this.titleElement},
						stepTitle: 'i18n.ob-tour.rainbow.step3.title',
						stepDescription: 'i18n.ob-tour.rainbow.step3.description'
					},
					{
						target: {elementRef: this.chooseTour},
						stepTitle: 'i18n.ob-tour.rainbow.step1.title',
						stepDescription: 'i18n.ob-tour.rainbow.step1.description'
					},
					{
						target: {elementRef: this.list1},
						stepTitle: 'i18n.ob-tour.rainbow.step2.title',
						stepDescription: 'i18n.ob-tour.rainbow.step2.description'
					},
					{
						target: {elementRef: this.list2},
						stepTitle: 'i18n.ob-tour.rainbow.step3.title',
						stepDescription: 'i18n.ob-tour.rainbow.step3.description'
					},
					{
						target: {elementRef: this.titleElement},
						stepTitle: 'i18n.ob-tour.rainbow.step3.title',
						stepDescription: 'i18n.ob-tour.rainbow.step3.description'
					}
				]
			},
			{
				tourTitle: 'i18n.ob-tour.glitter.title',
				tourDescription: 'i18n.ob-tour.glitter.description',
				storageKey: 'glitterGuideStorageKey',
				triggers: [{type: 'manual'}],
				state: 'inProgress',
				steps: [
					{
						target: {elementRef: this.list3},
						stepTitle: 'i18n.ob-tour.glitter.step1.title',
						stepDescription: 'i18n.ob-tour.glitter.step1.description'
					},
					{
						target: {elementSelector: 'improve-ax-active'},
						stepTitle: 'i18n.ob-tour.glitter.step2.title',
						stepDescription: 'i18n.ob-tour.glitter.step2.description'
					}
				]
			},
			{
				tourTitle: 'i18n.ob-tour.lovewins.title',
				tourDescription: 'i18n.ob-tour.lovewins.description',
				storageKey: 'loveWinsTourStorageKey',
				triggers: [{type: 'manual'}],
				state: 'new',
				steps: [
					{
						target: {elementSelector: 'tour-start-active'},
						stepTitle: 'i18n.ob-tour.lovewins.step1.title',
						stepDescription: 'i18n.ob-tour.tour.lovewins.step1.description'
					},
					{
						stepTitle: 'i18n.ob-tour.lovewins.step2.title',
						stepDescription: 'i18n.ob-tour.lovewins.step2.description'
					}
				]
			},
			{
				tourTitle: 'Without translation Key',
				tourDescription: 'Hallo Velo',
				storageKey: 'ohneTranslationStorageKey',
				triggers: [{type: 'manual'}],
				state: 'new',
				steps: [
					{
						target: {elementSelector: 'tour-start-active'},
						stepTitle: 'Step1 ohne translation',
						stepDescription: 'Descirption Step 1'
					},
					{
						target: {elementSelector: 'improve-ax-active'},
						stepTitle: 'step2.',
						stepDescription: 'laksjdflökjsdfjaölsdj asfsdfasdf asdf asdf adfa'
					}
				]
			}
		]
	};

	tourService = inject(ObtTourService);
	positionAbove: ObtMenuPositionsY = ObtMenuPositionsY.ABOVE;
	positionBelow: ObtMenuPositionsY = ObtMenuPositionsY.BELOW;
	positionStart: ObtMenuPositionsX = ObtMenuPositionsX.START;
	positionEnd: ObtMenuPositionsX = ObtMenuPositionsX.END;
}
