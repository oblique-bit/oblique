import {ObTelemetryService} from './telemetry.service';

export function requireAndRecordTelemetry(telemetry: ObTelemetryService, module: any): void {
	if (!telemetry) {
		throw Error('It is not allowed to use Oblique modules without telemetry!');
	}
	telemetry.record(module?.name || 'Unknown module');
}
