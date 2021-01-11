import {ObTelemetryRecord} from './telemetry-record';

describe('TelemetryRecord', () => {
	const record = new ObTelemetryRecord('Material');

	it('should has a record property', () => {
		expect(record.record).toEqual({
			applicationName: 'Unknown project name',
			applicationTitle: undefined,
			applicationVersion: 'Unknown project version',
			applicationHomepage: undefined,
			obliqueTheme: 'Material',
			obliqueVersion: '',
			obliqueModuleNames: []
		});
	});

	describe('addModule', () => {
		it('should add the module', () => {
			record.addModule('test');
			expect(record.record.obliqueModuleNames.indexOf('test') > -1).toBe(true);
		});
		it('should not add the same module twice', () => {
			record.addModule('test');
			record.addModule('test');
			expect(record.record.obliqueModuleNames.length).toBe(1);
		});
	});

	describe('isRecordToBeSent', () => {
		it('should return true if theres no timestamp', () => {
			jest.spyOn(localStorage, 'getItem').mockReturnValue('');
			expect(record.isRecordToBeSent()).toBe(true);
		});
		it('should return true if theres no modules', () => {
			jest.spyOn(localStorage, 'getItem').mockReturnValue('{"timestamp": 1}');
			expect(record.isRecordToBeSent()).toBe(true);
		});
		it('should return true if the timestamp is more than one day', () => {
			jest.spyOn(localStorage, 'getItem').mockReturnValue('{"timestamp": 1, "modules": []}');
			expect(record.isRecordToBeSent()).toBe(true);
		});
		it('should return true if there are missing modules', () => {
			const ts = +new Date() - 10;
			jest.spyOn(localStorage, 'getItem').mockReturnValue(`{"timestamp": ${ts}, "modules": []}`);
			record.addModule('test');
			expect(record.isRecordToBeSent()).toBe(true);
		});
		it('should return false if there are no changes', () => {
			const ts = +new Date() - 10;
			jest.spyOn(localStorage, 'getItem').mockReturnValue(`{"timestamp": ${ts}, "modules": [\"test\"]}`);
			record.addModule('test');
			expect(record.isRecordToBeSent()).toBe(false);
		});
	});

	describe('storeRecord', () => {
		jest.spyOn(localStorage, 'setItem');
		record.storeRecord();
		expect(localStorage.setItem).toHaveBeenCalled();
	});
});
