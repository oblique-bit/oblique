import {DOCUMENT, Injectable, RendererFactory2, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import type {ComponentType} from '@angular/cdk/overlay';
import type {CollectorConfiguration, CollectorDefaultValues, CollectorFunction} from './collector.model';

@Injectable()
export class CollectorService {
	private readonly renderer = inject(RendererFactory2).createRenderer(null, null);
	private readonly document = inject(DOCUMENT);
	private readonly dialog = inject(MatDialog);
	private openCollectorDialog: CollectorFunction;
	private defaultValuesInternal: CollectorDefaultValues = {};
	private fallbackDialogInternal: ComponentType<unknown>;

	set defaultValues(values: CollectorDefaultValues) {
		this.defaultValuesInternal = values ?? {};
	}

	set fallbackDialog(component: ComponentType<unknown>) {
		this.fallbackDialogInternal = component;
	}

	initializeCollector(collectorId: string): void {
		this.addCollectorScript(collectorId);
		window.ATL_JQ_PAGE_PROPS = this.configureCollector();
	}

	collect(): void {
		if (this.openCollectorDialog) {
			this.updateCollectorFields();
			this.openCollectorDialog();
		} else {
			this.dialog.open(this.fallbackDialogInternal);
		}
	}

	private addCollectorScript(collectorId: string): void {
		const script = this.renderer.createElement('script') as HTMLScriptElement;
		script.src = `https://jira.bit.admin.ch/plugins/servlet/issueCollectorBootstrap.js?collectorId=${collectorId}&locale=en_US`;
		this.renderer.appendChild(this.document.body, script);
	}

	private configureCollector(): CollectorConfiguration {
		return {
			triggerFunction: (showCollectorDialog: CollectorFunction) => {
				this.openCollectorDialog = showCollectorDialog;
			},
			fieldValues: () => ({})
		};
	}

	private updateCollectorFields(): void {
		Object.keys(this.defaultValuesInternal).forEach(key => {
			window.ATL_JQ_PAGE_PROPS.fieldValues[key] = this.defaultValuesInternal[key]();
		});
	}
}
