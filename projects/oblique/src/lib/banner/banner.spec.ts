import {buildBannerObject} from './banner';
import {ObEColor} from '../style/colors.model';

describe('banner', () => {
	test(buildBannerObject.name, () => {
		expect(buildBannerObject(undefined)).toEqual({color: '#fff', bgColor: ObEColor.ENV_LOCAL});
		expect(buildBannerObject('test')).toEqual({color: '#fff', bgColor: ObEColor.ENV_LOCAL, text: 'test'});
		expect(buildBannerObject('LOCAL')).toEqual({color: '#fff', bgColor: ObEColor.ENV_LOCAL, text: 'LOCAL'});
		expect(buildBannerObject('DEV')).toEqual({color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_DEV, text: 'DEV'});
		expect(buildBannerObject('REF')).toEqual({color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_REF, text: 'REF'});
		expect(buildBannerObject('TEST')).toEqual({color: '#fff', bgColor: ObEColor.ENV_TEST, text: 'TEST'});
		expect(buildBannerObject('ABN')).toEqual({color: '#fff', bgColor: ObEColor.ENV_ABN, text: 'ABN'});
		expect(buildBannerObject({text: 'test'})).toEqual({color: '#fff', bgColor: ObEColor.ENV_LOCAL, text: 'test'});
		expect(buildBannerObject({text: 'test', color: 'red'})).toEqual({
			color: 'red',
			bgColor: ObEColor.ENV_LOCAL,
			text: 'test',
		});
		expect(buildBannerObject({text: 'test', color: 'red', bgColor: 'blue'})).toEqual({
			color: 'red',
			bgColor: 'blue',
			text: 'test',
		});
		expect(buildBannerObject({text: 'ABN'})).toEqual({color: '#fff', bgColor: ObEColor.ENV_ABN, text: 'ABN'});
		expect(buildBannerObject({text: 'ABN', color: 'red'})).toEqual({
			color: 'red',
			bgColor: ObEColor.ENV_ABN,
			text: 'ABN',
		});
		expect(buildBannerObject({text: 'ABN', color: 'red', bgColor: 'blue'})).toEqual({
			color: 'red',
			bgColor: 'blue',
			text: 'ABN',
		});
	});
});
