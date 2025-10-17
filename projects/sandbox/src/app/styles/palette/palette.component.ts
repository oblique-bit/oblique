import {Component} from '@angular/core';
import type {Colors} from './palette.model';
import {ObEColor} from '@oblique/oblique';

@Component({
	selector: 'sb-palette',
	standalone: false,
	templateUrl: './palette.component.html',
	styleUrl: './palette.component.scss'
})
export class PaletteComponent {
	colorGroups: Colors[] = [
		{
			name: 'Secondary',
			colors: [
				{name: '$ob-secondary-50', color: '#f0f4f7', contrast: ObEColor.DEFAULT},
				{name: '$ob-secondary-100', color: '#dfe4e9', contrast: ObEColor.DEFAULT},
				{name: '$ob-secondary-200', color: '#acb4bd', contrast: ObEColor.DEFAULT},
				{name: '$ob-secondary-300', color: '#828e9a', contrast: ObEColor.DEFAULT},
				{name: '$ob-secondary-400', color: '#596978', contrast: '#ffffff'},
				{name: '$ob-secondary-500', color: '#46596b', contrast: '#ffffff'},
				{name: '$ob-secondary-600', color: '#2f4356', contrast: '#ffffff'},
				{name: '$ob-secondary-700', color: '#263645', contrast: '#ffffff'},
				{name: '$ob-secondary-800', color: '#1c2834', contrast: '#ffffff'},
				{name: '$ob-secondary-900', color: '#131b22', contrast: '#ffffff'}
			]
		},
		{
			name: 'Red',
			colors: [
				{name: '$ob-red-50', color: '#ffedee', contrast: ObEColor.DEFAULT},
				{name: '$ob-red-100', color: '#fae1e2', contrast: ObEColor.DEFAULT},
				{name: '$ob-red-200', color: '#ffccce', contrast: ObEColor.DEFAULT},
				{name: '$ob-red-300', color: '#fa9da1', contrast: '#ffffff'},
				{name: '$ob-red-400', color: '#fc656b', contrast: '#ffffff'},
				{name: '$ob-red-500', color: '#e53940', contrast: '#ffffff'},
				{name: '$ob-red-600', color: '#d8232a', contrast: '#ffffff'},
				{name: '$ob-red-700', color: '#bf1f25', contrast: '#ffffff'},
				{name: '$ob-red-800', color: '#99191e', contrast: '#ffffff'},
				{name: '$ob-red-900', color: '#801519', contrast: '#ffffff'}
			]
		},
		{
			name: 'Green',
			colors: [
				{name: '$ob-green-50', color: '#ecfdf5', contrast: ObEColor.DEFAULT},
				{name: '$ob-green-100', color: '#d1fae5', contrast: ObEColor.DEFAULT},
				{name: '$ob-green-200', color: '#a7f3d0', contrast: ObEColor.DEFAULT},
				{name: '$ob-green-300', color: '#6ee7b7', contrast: ObEColor.DEFAULT},
				{name: '$ob-green-400', color: '#34d399', contrast: '#ffffff'},
				{name: '$ob-green-500', color: '#10b981', contrast: '#ffffff'},
				{name: '$ob-green-600', color: '#059669', contrast: '#ffffff'},
				{name: '$ob-green-700', color: '#047857', contrast: '#ffffff'},
				{name: '$ob-green-800', color: '#065f46', contrast: '#ffffff'},
				{name: '$ob-green-900', color: '#064e3b', contrast: '#ffffff'}
			]
		},
		{
			name: 'Orange',
			colors: [
				{name: '$ob-orange-50 ', color: '#fff7ed', contrast: ObEColor.DEFAULT},
				{name: '$ob-orange-100', color: '#ffedd5', contrast: ObEColor.DEFAULT},
				{name: '$ob-orange-200', color: '#fed7aa', contrast: ObEColor.DEFAULT},
				{name: '$ob-orange-300', color: '#fdba74', contrast: ObEColor.DEFAULT},
				{name: '$ob-orange-400', color: '#fb923c', contrast: ObEColor.DEFAULT},
				{name: '$ob-orange-500', color: '#f97316', contrast: ObEColor.DEFAULT},
				{name: '$ob-orange-600', color: '#ea580c', contrast: '#ffffff'},
				{name: '$ob-orange-700', color: '#c2410c', contrast: '#ffffff'},
				{name: '$ob-orange-800', color: '#9a3412', contrast: '#ffffff'},
				{name: '$ob-orange-900', color: '#7c2d12', contrast: '#ffffff'}
			]
		},
		{
			name: 'Oblique',
			colors: [
				{name: '$ob-gray-extra-light', color: ObEColor.GRAY_EXTRA_LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-secondary-50'},
				{name: '$ob-gray-lighter', color: ObEColor.GRAY_LIGHTER, contrast: ObEColor.DEFAULT, details: '$ob-secondary-100'},
				{name: '$ob-gray-light', color: ObEColor.GRAY_LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-secondary-200'},
				{name: '$ob-gray', color: ObEColor.GRAY, contrast: ObEColor.DEFAULT, details: '$ob-secondary-300'},
				{name: '$ob-gray-dark', color: ObEColor.GRAY_DARK, contrast: '#ffffff', details: '$ob-secondary-500'},
				{name: '$ob-gray-darker', color: ObEColor.GRAY_DARKER, contrast: '#ffffff', details: '$ob-secondary-600'},
				{name: '$ob-default', color: ObEColor.DEFAULT, contrast: '#ffffff', details: '$ob-secondary-800'},
				{name: '$ob-accent', color: ObEColor.ACCENT, contrast: '#ffffff', details: '$ob-red-500'},
				{name: '$ob-extra-light', color: ObEColor.EXTRA_LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-secondary-50'},
				{name: '$ob-light', color: ObEColor.LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-secondary-200'},
				{name: '$ob-primary', color: ObEColor.PRIMARY, contrast: '#ffffff', details: '$ob-secondary-500'},
				{name: '$ob-dark', color: ObEColor.DARK, contrast: '#ffffff', details: '$ob-secondary-700'},
				{name: '$ob-success-light', color: ObEColor.SUCCESS_LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-green-100'},
				{name: '$ob-success', color: ObEColor.SUCCESS, contrast: '#ffffff', details: '$ob-green-700'},
				{name: '$ob-success-dark', color: ObEColor.SUCCESS_DARK, contrast: '#ffffff', details: '$ob-green-900'},
				{name: '$ob-warning-light', color: ObEColor.WARNING_LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-orange-100'},
				{name: '$ob-warning', color: ObEColor.WARNING, contrast: ObEColor.DEFAULT, details: '$ob-orange-600'},
				{name: '$ob-warning-dark', color: ObEColor.WARNING_DARK, contrast: '#ffffff', details: '$ob-orange-700'},
				{name: '$ob-error-light', color: ObEColor.ERROR_LIGHT, contrast: ObEColor.DEFAULT, details: '$ob-red-100'},
				{name: '$ob-error', color: ObEColor.ERROR, contrast: '#ffffff', details: '$ob-red-800'},
				{name: '$ob-error-dark', color: ObEColor.ERROR_DARK, contrast: '#ffffff', details: '$ob-red-900'}
			]
		}
	];
}
