import {Component} from '@angular/core';

interface Colors {
	name: string;
	colors: {
		name: string;
		color: string;
		contrast: string;
		details?: string;
	}[];
}

@Component({
	selector: 'or-palette',
	templateUrl: './palette.component.html',
	styleUrls: ['./palette.component.scss']
})
export class PaletteComponent {
	colorGroups: Colors[] = [
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
			name: 'Primary & accent',
			colors: [
				{name: '$primary-50', color: '#f2f7fa', contrast: '#171717'},
				{name: '$primary-100', color: '#cce0eb', contrast: '#171717'},
				{name: '$primary-300', color: '#99c2d6', contrast: '#171717'},
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
			name: 'Error',
			colors: [
				{name: '$error-50', color: '#f6e0e4', contrast: '#171717'},
				{name: '$error-100', color: '#ffdddd', contrast: '#171717'},
				{name: '$error-200', color: '#d88090', contrast: '#171717'},
				{name: '$error-300', color: '#c84d63', contrast: '#ffffff'},
				{name: '$error-400', color: '#bc2641', contrast: '#ffffff'},
				{name: '$error-500', color: '#b00020', contrast: '#ffffff'},
				{name: '$error-600', color: '#a9001c', contrast: '#ffffff'},
				{name: '$error-700', color: '#770000', contrast: '#ffffff'},
				{name: '$error-800', color: '#970013', contrast: '#ffffff'},
				{name: '$error-900', color: '#87000b', contrast: '#ffffff'},
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
				{name: '$success-100', color: '#cfe6c2', contrast: '#171717'},
				{name: '$success-500', color: '#00813a', contrast: '#ffffff'},
				{name: '$success-700', color: '#004d22', contrast: '#ffffff'}
			]
		},
		{
			name: 'Warning',
			colors: [
				{name: '$warning-100', color: '#ffe2c2', contrast: '#171717'},
				{name: '$warning-500', color: '#e75e00', contrast: '#ffffff'},
				{name: '$warning-700', color: '#9c3c0a', contrast: '#ffffff'}
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
				{name: '$brand-success-light', color: '#cfe6c2', contrast: '#171717', details: '$success-100'},
				{name: '$brand-success', color: '#00813a', contrast: '#ffffff', details: '$success-500'},
				{name: '$brand-success-dark', color: '#004d22', contrast: '#ffffff', details: '$success-700'},
				{name: '$brand-info-light', color: '#e6eff3', contrast: '#171717'},
				{name: '$brand-info', color: '#006699', contrast: '#ffffff', details: '$primary-500'},
				{name: '$brand-info-dark', color: '#004569', contrast: '#ffffff'},
				{name: '$brand-warning-light', color: '#ffe2c2', contrast: '#171717', details: '$warning-100'},
				{name: '$brand-warning', color: '#e75e00', contrast: '#ffffff', details: '$warning-500'},
				{name: '$brand-warning-dark', color: '#983d00', contrast: '#ffffff', details: '$warning-700'},
				{name: '$brand-error-light', color: '#ffdddd', contrast: '#171717'},
				{name: '$brand-error', color: '#dc0018', contrast: '#ffffff', details: 'error-500'},
				{name: '$brand-error-dark', color: '#b30014', contrast: '#ffffff'}
			]
		}
	];
}
