import type {ObEIcon} from '@oblique/oblique';

export interface ObILink {
	de: string;
	fr: string;
	it: string;
	en: string;
	link?: string;
	links: {
		de: string;
		fr: string;
		it: string;
		en: string;
	};
}

export interface ObIContactWithExtraTextMultipleLanguages {
	emailText?: ObITranslateObject;
	email?: string;
	telText?: ObITranslateObject;
	tel?: string;
	formUrlText?: ObITranslateObject;
	formUrl?: string;
}

export interface ObITranslateObject {
	de: string;
	fr: string;
	it: string;
	en: string;
}

export interface ObICustomButton {
	obliqueIconName: ObEIcon;
	badge: string;
	tooltip?: string;
	accessibilityText?: string;
}
