declare global {
	interface Window {
		ATL_JQ_PAGE_PROPS: CollectorConfiguration; // eslint-disable-line @typescript-eslint/naming-convention
	}
}

export interface CollectorConfiguration {
	triggerFunction: (showCollectorDialog: CollectorFunction) => void;
	fieldValues: () => CollectorFieldValue;
}

export type CollectorFunction = () => void;

export type CollectorFieldValue = Record<string, string>;

export type CollectorDefaultValues = Record<string, () => string>;
