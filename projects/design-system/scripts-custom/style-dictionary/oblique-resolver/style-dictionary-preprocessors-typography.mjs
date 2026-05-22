// there are some special cases where there is no "typography" token in Figma but a collection of specific tokens instead
// for consistency, we convert it to a typography token, but this can only be done if both "font_family" and "font_size"
// are defined

export function buildTypographyToken(token) {
	if (token.font_family && token.font_size) {
		const compositeToken = buildCompositeToken(token);
		replaceWithCompositeToken(token, compositeToken);
	}
	return token;
}

function buildCompositeToken(token) {
	return Object.keys(token).reduce(
		(typographyToken, current) => ({...typographyToken, [snakeToCamel(current)]: token[current].$value}),
		{}
	);
}

function snakeToCamel(str) {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function replaceWithCompositeToken(token, compositeToken) {
	// objects are passed by reference, meaning we can't create a new object as this would break the reference
	Object.keys(token).forEach(key => delete token[key]);
	token.$type = 'typography';
	token.$value = compositeToken;
}
