import {requireAndRecordTelemetry} from './telemetry-require';
import {ObTelemetryService} from './telemetry.service';

describe('TelemetryRequire', () => {
	it('should throw on undefined telemetry service', () => {
		expect(() => requireAndRecordTelemetry(undefined, undefined)).toThrowError('It is not allowed to use Oblique modules without telemetry!');
	});
	it("should record the module's name", () => {
		const mock = ({record: jest.fn()} as unknown) as ObTelemetryService;
		requireAndRecordTelemetry(mock, {name: 'test'});
		expect(mock.record).toHaveBeenCalledWith('test');
	});
	it('should record a default name if name is not provided', () => {
		const mock = ({record: jest.fn()} as unknown) as ObTelemetryService;
		requireAndRecordTelemetry(mock, undefined);
		expect(mock.record).toHaveBeenCalledWith('Unknown module');
	});
});
