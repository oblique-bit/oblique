import {ObTelemetryService} from './telemetry.service';

export function requireAndRecordTelemetry(telemetry: ObTelemetryService, module: any) {
	if (!telemetry) {
		throw Error('It is not allowed to use Oblique modules without telemetry!');
	}
	telemetry.record(module);
}
