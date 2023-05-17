import {Component} from '@angular/core';
import {Colors} from './palette.model';
import {ObEColor} from '@oblique/oblique';

@Component({
	selector: 'sb-palette',
	templateUrl: './palette.component.html',
	styleUrls: ['./palette.component.scss']
})
export class PaletteComponent {
	colorGroups: Colors[] = [
		{
			name: 'CI / CD',
			colors: [
				{name: '$venetian-red', color: ObEColor.ACCENT, contrast: '#ffffff'},
				{name: '$red', color: '#f7001d', contrast: '#ffffff', details: 'unused'},
				{name: '$cerulean', color: ObEColor.PRIMARY, contrast: '#ffffff'},
				{name: '$malibu', color: '#66afe9', contrast: ObEColor.DEFAULT, details: 'unused'},
				{name: '$pattens-blue', color: '#d8e8ef', contrast: ObEColor.DEFAULT, details: 'unused'},
				{name: '$solitude', color: '#e7edef', contrast: ObEColor.DEFAULT, details: 'unused'},
				{name: '$clear-day', color: '#f2f7f9', contrast: ObEColor.DEFAULT, details: 'unused'},
				{name: '$mocassin', color: '#fffab2', contrast: ObEColor.DEFAULT, details: 'unused'},
				{name: '$white', color: '#ffffff', contrast: ObEColor.DEFAULT},
				{name: '$smoke', color: ObEColor.GRAY_EXTRA_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$gainsboro', color: ObEColor.GRAY_LIGHTER, contrast: ObEColor.DEFAULT},
				{name: '$light-gray', color: ObEColor.GRAY_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$silver', color: '#cccccc', contrast: ObEColor.DEFAULT, details: 'unused'},
				{name: '$empress', color: ObEColor.GRAY_DARK, contrast: '#ffffff'},
				{name: '$coal', color: '#454545', contrast: '#ffffff'},
				{name: '$night-rider', color: ObEColor.GRAY_DARKER, contrast: '#ffffff'},
				{name: '$black', color: '#000000', contrast: '#ffffff'}
			]
		},
		{
			name: 'Primary',
			colors: [
				{name: '$primary-50', color: ObEColor.EXTRA_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$primary-100', color: ObEColor.LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$primary-200', color: '#99c2d6', contrast: ObEColor.DEFAULT},
				{name: '$primary-300', color: '#66a3c2', contrast: ObEColor.DEFAULT},
				{name: '$primary-400', color: '#267da8', contrast: '#ffffff'},
				{name: '$primary-500', color: ObEColor.PRIMARY, contrast: '#ffffff', details: '$ceruelan'},
				{name: '$primary-600', color: '#0a5b84', contrast: '#ffffff'},
				{name: '$primary-700', color: ObEColor.DARK, contrast: '#ffffff'},
				{name: '$primary-800', color: '#214456', contrast: '#ffffff'},
				{name: '$primary-900', color: '#293d47', contrast: '#ffffff'},
				{name: '$primary-a100', color: '#90c0ff', contrast: ObEColor.DEFAULT},
				{name: '$primary-a200', color: '#5da3ff', contrast: ObEColor.DEFAULT},
				{name: '$primary-a400', color: '#2a85ff', contrast: '#ffffff'},
				{name: '$primary-a700', color: '#1077ff', contrast: '#ffffff'}
			]
		},
		{
			name: 'Accent',
			colors: [
				{name: '$accent-50', color: '#eff7fc', contrast: ObEColor.DEFAULT},
				{name: '$accent-100', color: '#d1e7f8', contrast: ObEColor.DEFAULT},
				{name: '$accent-200', color: '#b2d7f4', contrast: ObEColor.DEFAULT},
				{name: '$accent-300', color: '#9bcbf0', contrast: ObEColor.DEFAULT},
				{name: '$accent-400', color: '#66afe9', contrast: ObEColor.DEFAULT, details: '$malibu'},
				{name: '$accent-500', color: '#60a2d6', contrast: '#ffffff'},
				{name: '$accent-600', color: '#5990bb', contrast: '#ffffff'},
				{name: '$accent-700', color: '#517d9f', contrast: '#ffffff'},
				{name: '$accent-800', color: '#47657c', contrast: '#ffffff'},
				{name: '$accent-900', color: '#3d5c57', contrast: '#ffffff'},
				{name: '$accent-a100', color: '#90c0ff', contrast: ObEColor.DEFAULT},
				{name: '$accent-a200', color: '#5da3ff', contrast: ObEColor.DEFAULT},
				{name: '$accent-a400', color: '#2a85ff', contrast: '#ffffff'},
				{name: '$accent-a700', color: '#1077ff', contrast: '#ffffff'}
			]
		},
		{
			name: 'Error',
			colors: [
				{name: '$error-50', color: '#fdeaee', contrast: ObEColor.DEFAULT},
				{name: '$error-100', color: ObEColor.ERROR_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$error-200', color: '#ea959b', contrast: ObEColor.DEFAULT},
				{name: '$error-300', color: '#de6c74', contrast: '#ffffff'},
				{name: '$error-400', color: '#de2839', contrast: '#ffffff'},
				{name: '$error-500', color: ObEColor.ERROR, contrast: '#ffffff'},
				{name: '$error-600', color: '#a31a17', contrast: '#ffffff'},
				{name: '$error-700', color: ObEColor.ERROR_DARK, contrast: '#ffffff'},
				{name: '$error-800', color: '#86090c', contrast: '#ffffff'},
				{name: '$error-900', color: '#630012', contrast: '#ffffff'},
				{name: '$error-a100', color: '#ffb3b6', contrast: ObEColor.DEFAULT},
				{name: '$error-a200', color: '#ff8085', contrast: ObEColor.DEFAULT},
				{name: '$error-a400', color: '#ff4d53', contrast: ObEColor.DEFAULT},
				{name: '$error-a700', color: '#ff343b', contrast: ObEColor.DEFAULT}
			]
		},
		{
			name: 'Gray',
			colors: [
				{name: '$gray-50', color: '#ffffff', contrast: ObEColor.DEFAULT, details: '$white'},
				{name: '$gray-100', color: ObEColor.GRAY_EXTRA_LIGHT, contrast: ObEColor.DEFAULT, details: '$smoke'},
				{name: '$gray-200', color: ObEColor.GRAY_LIGHT, contrast: ObEColor.DEFAULT, details: '$gainsboro'},
				{name: '$gray-300', color: ObEColor.GRAY_LIGHT, contrast: ObEColor.DEFAULT, details: '$light-gray'},
				{name: '$gray-400', color: ObEColor.GRAY, contrast: ObEColor.DEFAULT},
				{name: '$gray-500', color: ObEColor.GRAY_DARK, contrast: '#ffffff', details: '$empress'},
				{name: '$gray-600', color: '#454545', contrast: '#ffffff', details: '$coal'},
				{name: '$gray-700', color: ObEColor.GRAY_DARKER, contrast: '#ffffff', details: '$night-rider'},
				{name: '$gray-800', color: ObEColor.DEFAULT, contrast: '#ffffff'},
				{name: '$gray-900', color: '#000000', contrast: '#ffffff', details: '$black'}
			]
		},
		{
			name: 'Success',
			colors: [
				{name: '$success-50', color: '#e6f6eb', contrast: ObEColor.DEFAULT},
				{name: '$success-100', color: ObEColor.SUCCESS_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$success-200', color: '#9cd9ad', contrast: ObEColor.DEFAULT},
				{name: '$success-300', color: '#72cb8c', contrast: ObEColor.DEFAULT},
				{name: '$success-400', color: '#50bf73', contrast: '#ffffff'},
				{name: '$success-500', color: '#27b45b', contrast: '#ffffff'},
				{name: '$success-600', color: '#1da451', contrast: '#ffffff'},
				{name: '$success-700', color: '#0f9245', contrast: '#ffffff'},
				{name: '$success-800', color: ObEColor.SUCCESS, contrast: '#ffffff'},
				{name: '$success-900', color: ObEColor.SUCCESS_DARK, contrast: '#ffffff'}
			]
		},
		{
			name: 'Warning',
			colors: [
				{name: '$warning-50 ', color: ObEColor.WARNING_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$warning-100', color: '#fed284', contrast: ObEColor.DEFAULT},
				{name: '$warning-200', color: '#ffbf52', contrast: ObEColor.DEFAULT},
				{name: '$warning-300', color: '#fb970b', contrast: ObEColor.DEFAULT},
				{name: '$warning-400', color: '#f07703', contrast: ObEColor.DEFAULT},
				{name: '$warning-500', color: ObEColor.WARNING, contrast: ObEColor.DEFAULT},
				{name: '$warning-600', color: '#af4600', contrast: '#ffffff'},
				{name: '$warning-700', color: ObEColor.WARNING_DARK, contrast: '#ffffff'},
				{name: '$warning-800', color: '#5f1a00', contrast: '#ffffff'},
				{name: '$warning-900', color: '#501900', contrast: '#ffffff'}
			]
		},
		{
			name: 'Oblique',
			colors: [
				{name: '$gray-extra-light', color: ObEColor.GRAY_EXTRA_LIGHT, contrast: ObEColor.DEFAULT, details: '$gray-100'},
				{name: '$gray-lighter', color: ObEColor.GRAY_LIGHTER, contrast: ObEColor.DEFAULT, details: '$gray-200'},
				{name: '$gray-light', color: ObEColor.GRAY_LIGHT, contrast: ObEColor.DEFAULT, details: '$gray-300'},
				{name: '$gray', color: ObEColor.GRAY, contrast: ObEColor.DEFAULT, details: '$gray-400'},
				{name: '$gray-dark', color: ObEColor.GRAY_DARK, contrast: '#ffffff', details: '$gray-500'},
				{name: '$gray-darker', color: ObEColor.GRAY_DARKER, contrast: '#ffffff', details: '$gray-700'},
				{name: '$brand-default', color: ObEColor.DEFAULT, contrast: '#ffffff', details: '$gray-800'},
				{name: '$brand-accent', color: ObEColor.ACCENT, contrast: '#ffffff', details: '$venetian-red'},
				{name: '$brand-extra-light', color: ObEColor.EXTRA_LIGHT, contrast: ObEColor.DEFAULT, details: '$primary-50'},
				{name: '$brand-light', color: ObEColor.LIGHT, contrast: ObEColor.DEFAULT, details: '$primary-100'},
				{name: '$brand-primary', color: ObEColor.PRIMARY, contrast: '#ffffff', details: '$primary-500'},
				{name: '$brand-dark', color: ObEColor.DARK, contrast: '#ffffff', details: '$primary-700'},
				{name: '$brand-success-light', color: ObEColor.SUCCESS_LIGHT, contrast: ObEColor.DEFAULT, details: '$success-100'},
				{name: '$brand-success', color: ObEColor.SUCCESS, contrast: '#ffffff', details: '$success-800'},
				{name: '$brand-success-dark', color: ObEColor.SUCCESS_DARK, contrast: '#ffffff', details: '$success-900'},
				{name: '$brand-warning-light', color: ObEColor.WARNING_LIGHT, contrast: ObEColor.DEFAULT, details: '$warning-50'},
				{name: '$brand-warning', color: ObEColor.WARNING, contrast: ObEColor.DEFAULT, details: '$warning-500'},
				{name: '$brand-warning-dark', color: ObEColor.WARNING_DARK, contrast: '#ffffff', details: '$warning-700'},
				{name: '$brand-error-light', color: ObEColor.ERROR_LIGHT, contrast: ObEColor.DEFAULT},
				{name: '$brand-error', color: ObEColor.ERROR, contrast: '#ffffff', details: 'error-500'},
				{name: '$brand-error-dark', color: ObEColor.ERROR_DARK, contrast: '#ffffff'}
			]
		}
	];
}
