export interface ObITranslationFile {
	prefix: string;
	suffix: string;
}

// because a type can't reference itself
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface DeepString {
	[key: string]: DeepString | string;
}
