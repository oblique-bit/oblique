import {ObEIcon} from '@oblique/oblique';

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

export interface ObICustomButton {
	obliqueIconName: ObEIcon;
	badge: string;
}
