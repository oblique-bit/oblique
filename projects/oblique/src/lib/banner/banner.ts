import {ObEEnvironment, ObIBanner, ObTBanner} from './banner.model';
import {ObEColor} from '../style/colors.model';

export function buildBannerObject(bannerToken: ObTBanner): ObIBanner {
	const obIBanner = typeof bannerToken === 'string' ? {text: bannerToken} : bannerToken;

	switch (obIBanner?.text as ObEEnvironment) {
		case ObEEnvironment.LOCAL:
			return {color: '#fff', bgColor: ObEColor.ENV_LOCAL, ...obIBanner};
		case ObEEnvironment.DEV:
			return {color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_DEV, ...obIBanner};
		case ObEEnvironment.REF:
			return {color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_REF, ...obIBanner};
		case ObEEnvironment.TEST:
			return {color: '#fff', bgColor: ObEColor.ENV_TEST, ...obIBanner};
		case ObEEnvironment.ABN:
			return {color: '#fff', bgColor: ObEColor.ENV_ABN, ...obIBanner};
		default:
			return {color: '#fff', bgColor: ObEColor.ENV_LOCAL, ...obIBanner};
	}
}
