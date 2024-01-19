declare global {
	interface Window {
		ATL_JQ_PAGE_PROPS: CollectorConfiguration; // eslint-disable-line @typescript-eslint/naming-convention
	}
}

export interface CollectorConfiguration {
	triggerFunction: (showCollectorDialog: CollectorFunction) => void;
}

export type CollectorFunction = () => void;
