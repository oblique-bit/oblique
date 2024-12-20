export interface ObITranslationFile {
	prefix: string;
	suffix: string;
}

export interface DeepString {
	[key: string]: DeepString | string;
}
