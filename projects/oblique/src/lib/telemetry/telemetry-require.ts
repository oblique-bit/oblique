import {TelemetryService} from './telemetry.service';

export function requireAndRecordTelemetry(telemetry: TelemetryService, module: any) {
	if (!telemetry) {
		throw Error('It is not allowed to use Oblique modules without telemetry!');
	}
	telemetry.record(module);
}
