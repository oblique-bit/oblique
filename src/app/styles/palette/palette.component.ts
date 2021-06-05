import {Component} from '@angular/core';
import {ObIColors} from './palette.model';

@Component({
	selector: 'ob-palette',
	templateUrl: './palette.component.html',
	styleUrls: ['./palette.component.scss']
})
export class ObPaletteComponent {
	colorGroups: ObIColors[] = [
		{
			name: 'CI / CD',
			colors: [
				{name: '$venetian-red', color: '#dc0018', contrast: '#ffffff'},
				{name: '$red', color: '#f7001d', contrast: '#ffffff', details: 'unused'},
				{name: '$cerulean', color: '#006699', contrast: '#ffffff'},
				{name: '$malibu', color: '#66afe9', contrast: '#171717', details: 'bootstrap only'},
				{name: '$pattens-blue', color: '#d8e8ef', contrast: '#171717', details: 'unused'},
				{name: '$solitude', color: '#e7edef', contrast: '#171717', details: 'unused'},
				{name: '$clear-day', color: '#f2f7f9', contrast: '#171717', details: 'unused'},
				{name: '$mocassin', color: '#fffab2', contrast: '#171717', details: 'unused'},
				{name: '$white', color: '#ffffff', contrast: '#171717'},
				{name: '$smoke', color: '#f5f5f5', contrast: '#171717'},
				{name: '$gainsboro', color: '#e5e5e5', contrast: '#171717'},
				{name: '$light-gray', color: '#d5d5d5', contrast: '#171717'},
				{name: '$silver', color: '#cccccc', contrast: '#171717', details: 'unused'},
				{name: '$empress', color: '#757575', contrast: '#ffffff'},
				{name: '$coal', color: '#454545', contrast: '#ffffff'},
				{name: '$night-rider', color: '#333333', contrast: '#ffffff'},
				{name: '$black', color: '#000000', contrast: '#ffffff'}
			]
		},
		{
			name: 'Primary',
			colors: [
				{name: '$primary-50', color: '#f2f7fa', contrast: '#171717'},
				{name: '$primary-100', color: '#cce0eb', contrast: '#171717'},
				{name: '$primary-200', color: '#99c2d6', contrast: '#171717'},
				{name: '$primary-300', color: '#66a3c2', contrast: '#171717'},
				{name: '$primary-400', color: '#267da8', contrast: '#ffffff'},
				{name: '$primary-500', color: '#006699', contrast: '#ffffff', details: '$ceruelan'},
				{name: '$primary-600', color: '#0a5b84', contrast: '#ffffff'},
				{name: '$primary-700', color: '#14516f', contrast: '#ffffff'},
				{name: '$primary-800', color: '#214456', contrast: '#ffffff'},
				{name: '$primary-900', color: '#293d47', contrast: '#ffffff'},
				{name: '$primary-a100', color: '#90c0ff', contrast: '#171717'},
				{name: '$primary-a200', color: '#5da3ff', contrast: '#171717'},
				{name: '$primary-a400', color: '#2a85ff', contrast: '#ffffff'},
				{name: '$primary-a700', color: '#1077ff', contrast: '#ffffff'}
			]
		},
		{
			name: 'Accent',
			colors: [
				{name: '$accent-50', color: '#eff7fc', contrast: '#171717'},
				{name: '$accent-100', color: '#d1e7f8', contrast: '#171717'},
				{name: '$accent-200', color: '#b2d7f4', contrast: '#171717'},
				{name: '$accent-300', color: '#9bcbf0', contrast: '#171717'},
				{name: '$accent-400', color: '#66afe9', contrast: '#171717', details: '$malibu'},
				{name: '$accent-500', color: '#60a2d6', contrast: '#ffffff'},
				{name: '$accent-600', color: '#5990bb', contrast: '#ffffff'},
				{name: '$accent-700', color: '#517d9f', contrast: '#ffffff'},
				{name: '$accent-800', color: '#47657c', contrast: '#ffffff'},
				{name: '$accent-900', color: '#3d5c57', contrast: '#ffffff'},
				{name: '$accent-a100', color: '#90c0ff', contrast: '#171717'},
				{name: '$accent-a200', color: '#5da3ff', contrast: '#171717'},
				{name: '$accent-a400', color: '#2a85ff', contrast: '#ffffff'},
				{name: '$accent-a700', color: '#1077ff', contrast: '#ffffff'}
			]
		},
		{
			name: 'Error',
			colors: [
				{name: '$error-50', color: '#fdeaee', contrast: '#171717'},
				{name: '$error-100', color: '#fbcad2', contrast: '#171717'},
				{name: '$error-200', color: '#ea959b', contrast: '#171717'},
				{name: '$error-300', color: '#de6c74', contrast: '#ffffff'},
				{name: '$error-400', color: '#de2839', contrast: '#ffffff'},
				{name: '$error-500', color: '#b00020', contrast: '#ffffff'},
				{name: '$error-600', color: '#a31a17', contrast: '#ffffff'},
				{name: '$error-700', color: '#931012', contrast: '#ffffff'},
				{name: '$error-800', color: '#86090c', contrast: '#ffffff'},
				{name: '$error-900', color: '#630012', contrast: '#ffffff'},
				{name: '$error-a100', color: '#ffb3b6', contrast: '#171717'},
				{name: '$error-a200', color: '#ff8085', contrast: '#171717'},
				{name: '$error-a400', color: '#ff4d53', contrast: '#171717'},
				{name: '$error-a700', color: '#ff343b', contrast: '#171717'}
			]
		},
		{
			name: 'Gray',
			colors: [
				{name: '$gray-50', color: '#ffffff', contrast: '#171717', details: '$white'},
				{name: '$gray-100', color: '#f5f5f5', contrast: '#171717', details: '$smoke'},
				{name: '$gray-200', color: '#e5e5e5', contrast: '#171717', details: '$gainsboro'},
				{name: '$gray-300', color: '#d5d5d5', contrast: '#171717', details: '$light-gray'},
				{name: '$gray-400', color: '#b4b4b4', contrast: '#171717'},
				{name: '$gray-500', color: '#757575', contrast: '#ffffff', details: '$empress'},
				{name: '$gray-600', color: '#454545', contrast: '#ffffff', details: '$coal'},
				{name: '$gray-700', color: '#333333', contrast: '#ffffff', details: '$night-rider'},
				{name: '$gray-800', color: '#171717', contrast: '#ffffff'},
				{name: '$gray-900', color: '#000000', contrast: '#ffffff', details: '$black'}
			]
		},
		{
			name: 'Success',
			colors: [
				{name: '$success-50', color: '#e6f6eb', contrast: '#171717'},
				{name: '$success-100', color: '#c3e8cd', contrast: '#171717'},
				{name: '$success-200', color: '#9cd9ad', contrast: '#171717'},
				{name: '$success-300', color: '#72cb8c', contrast: '#171717'},
				{name: '$success-400', color: '#50bf73', contrast: '#ffffff'},
				{name: '$success-500', color: '#27b45b', contrast: '#ffffff'},
				{name: '$success-600', color: '#1da451', contrast: '#ffffff'},
				{name: '$success-700', color: '#0f9245', contrast: '#ffffff'},
				{name: '$success-800', color: '#00813a', contrast: '#ffffff'},
				{name: '$success-900', color: '#006226', contrast: '#ffffff'}
			]
		},
		{
			name: 'Warning',
			colors: [
				{name: '$warning-50 ', color: '#fee3b5', contrast: '#171717'},
				{name: '$warning-100', color: '#fed284', contrast: '#171717'},
				{name: '$warning-200', color: '#ffbf52', contrast: '#171717'},
				{name: '$warning-300', color: '#fb970b', contrast: '#171717'},
				{name: '$warning-400', color: '#f07703', contrast: '#ffffff'},
				{name: '$warning-500', color: '#e75e00', contrast: '#ffffff'},
				{name: '$warning-600', color: '#af4600', contrast: '#ffffff'},
				{name: '$warning-700', color: '#80310d', contrast: '#ffffff'},
				{name: '$warning-800', color: '#5f1a00', contrast: '#ffffff'},
				{name: '$warning-900', color: '#501900', contrast: '#ffffff'}
			]
		},
		{
			name: 'Oblique',
			colors: [
				{name: '$gray-extra-light', color: '#f5f5f5', contrast: '#171717', details: '$gray-100'},
				{name: '$gray-lighter', color: '#e5e5e5', contrast: '#171717', details: '$gray-200'},
				{name: '$gray-light', color: '#d5d5d5', contrast: '#171717', details: '$gray-300'},
				{name: '$gray', color: '#b4b4b4', contrast: '#171717', details: '$gray-400'},
				{name: '$gray-dark', color: '#757575', contrast: '#ffffff', details: '$gray-500'},
				{name: '$gray-darker', color: '#333333', contrast: '#ffffff', details: '$gray-700'},
				{name: '$brand-default', color: '#171717', contrast: '#ffffff', details: '$gray-800'},
				{name: '$brand-accent', color: '#dc0018', contrast: '#ffffff', details: '$venetian-red'},
				{name: '$brand-extra-light', color: '#f2f7fa', contrast: '#171717', details: '$primary-50'},
				{name: '$brand-light', color: '#cce0eb', contrast: '#171717', details: '$primary-100'},
				{name: '$brand-primary', color: '#006699', contrast: '#ffffff', details: '$primary-500'},
				{name: '$brand-dark', color: '#14516f', contrast: '#ffffff', details: '$primary-700'},
				{name: '$brand-success-light', color: '#c3e8cd', contrast: '#171717', details: '$success-100'},
				{name: '$brand-success', color: '#00813a', contrast: '#ffffff', details: '$success-800'},
				{name: '$brand-success-dark', color: '#006226', contrast: '#ffffff', details: '$success-900'},
				{name: '$brand-warning-light', color: '#fee3b5', contrast: '#171717', details: '$warning-50'},
				{name: '$brand-warning', color: '#e75e00', contrast: '#ffffff', details: '$warning-500'},
				{name: '$brand-warning-dark', color: '#80310d', contrast: '#ffffff', details: '$warning-700'},
				{name: '$brand-error-light', color: '#fbcad2', contrast: '#171717'},
				{name: '$brand-error', color: '#b00020', contrast: '#ffffff', details: 'error-500'},
				{name: '$brand-error-dark', color: '#931012', contrast: '#ffffff'}
			]
		}
	];
}
