import {requireAndRecordTelemetry} from './telemetry-require';

describe('TelemetryRequire', () => {
	it('should throw on undefined telemetry service', () => {
		try {
			requireAndRecordTelemetry(undefined, undefined);

			fail('requireAndRecordTelemetry did not throw an error!');
		} catch (e) {
			// empty on purpose
		}
	});
});
