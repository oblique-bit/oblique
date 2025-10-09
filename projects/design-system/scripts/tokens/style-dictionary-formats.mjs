import {TokenFormat} from './style-dictionary-formats-token-store.mjs';

export const coreFormat = {
	name: 'oblique/core',
	format: data => TokenFormat.getInstance().core(data)
};
