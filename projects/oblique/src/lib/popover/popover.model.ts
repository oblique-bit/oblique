import {Options} from '@popperjs/core';

export const defaultConfig: Options = {
	placement: 'auto',
	strategy: 'absolute',
	modifiers: [
		{
			name: 'arrow',
			options: {
				element: '.ob-popover-arrow'
			}
		},
		{
			name: 'offset',
			options: {
				offset: [0, 16]
			}
		},
		{
			name: 'computeStyles',
			options: {
				gpuAcceleration: false
			}
		},
		{
			name: 'flip',
			options: {
				padding: 2
			}
		}
	]
};
