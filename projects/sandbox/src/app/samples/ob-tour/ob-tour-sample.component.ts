import {Component, inject} from '@angular/core';
import {ObTourService, type ObToursConfig} from '@oblique/ob-tour';

@Component({
	selector: 'sb-ob-tour',
	templateUrl: './ob-tour-sample.component.html',
	styleUrl: './ob-tour-sample.component.scss',
	standalone: false
})
export class ObTourSampleComponent {
	tourConfig: ObToursConfig = {
		tours: [
			{
				tourTitle: 'i18n.ob-tour.rainbow.title',
				tourDescription: 'i18n.ob-tour.rainbow.description',
				storageKey: 'rainbowTourStorageKey',
				triggers: [{type: 'manual'}],
				state: 'new',
				steps: [
					{
						stepTitle: 'i18n.ob-tour.rainbow.step1.title',
						stepDescription: 'i18n.ob-tour.rainbow.step1.description'
					},
					{
						stepTitle: 'i18n.ob-tour.rainbow.step2.title',
						stepDescription: 'i18n.ob-tour.rainbow.step2.description'
					},
					{
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
				state: 'new',
				steps: [
					{
						stepTitle: 'i18n.ob-tour.glitter.step1.title',
						stepDescription: 'i18n.ob-tour.glitter.step1.description'
					},
					{
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
						stepTitle: 'Step1 ohne translation',
						stepDescription: 'Descirption Step 1'
					},
					{
						stepTitle: 'step2.',
						stepDescription: 'laksjdflökjsdfjaölsdj asfsdfasdf asdf asdf adfa'
					}
				]
			}
		]
	};

	tourService = inject(ObTourService);
}
