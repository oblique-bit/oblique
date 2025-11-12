export const kebabTransform = {
	name: 'oblique/kebab',
	type: 'name',
	transform: token =>
		token.path
			.map(item => item.replace(/([a-z])([A-Z])/g, '$1_$2'))
			.join('-')
			.toLowerCase(),
};

export const colorTransform = {
	name: 'oblique/color',
	type: 'value',
	filter: token => token.$type === 'color',
	transform: token => token.$value.toLowerCase(),
};
