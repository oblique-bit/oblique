import {buildTypographyToken} from './style-dictionary-preprocessors-typography.mjs';

export const compositionPreprocessor = {
	name: 'oblique/composition',
	preprocessor: dictionary => walk(dictionary, false)
};

function walk(dictionary, isTypographicToken) {
	for (const key in dictionary) {
		if (dictionary[key] && typeof dictionary[key] === 'object') {
			if (isTypographicToken) {
				dictionary[key] = buildTypographyToken(dictionary[key]);
			}
			dictionary[key] = parseToken(dictionary[key]);
			walk(dictionary[key], key === 'typography');
		}
	}
	return dictionary;
}

function parseToken(token) {
	switch (token.$type) {
		case 'boxShadow': {
			return flattenBoxShadow(token);
		}
		case 'typography': {
			return flattenTypography(token);
		}
		case 'asset': {
			// assets are icons. they are ignored as they are not available as CSS variables
			return {};
		}
		default: {
			return token;
		}
	}
}

function flattenBoxShadow(token) {
	if (typeof token.$value === 'string') {
		return token;
	}
	const boxShadows = Array.isArray(token.$value) ? token.$value : [token.$value];
	return {...token, $value: boxShadows.map(shadow => `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`).join(', ')};
}

function flattenTypography(token) {
	const value = token.$value;
	if (typeof value !== 'object' || !value.fontSize || !value.fontFamily) {
		return token;
	}
	const fontSize = value.lineHeight ? `${value.fontSize}/${value.lineHeight}` : value.fontSize;
	const font = [value.fontStyle, value.fontVariant, value.fontWeight, value.fontStretch, fontSize, value.fontFamily]
		.filter(Boolean)
		.join(' ');
	const nonFontValues = Object.keys(value)
		.filter(key => !['fontFamily', 'fontSize', 'fontStretch', 'fontStyle', 'fontVariant', 'fontWeight', 'lineHeight'].includes(key))
		.reduce((font, key) => ({...font, [key]: value[key]}), {});

	return {
		...token,
		$value: {
			font,
			...nonFontValues
		}
	};
}
