import {AfterViewInit, Component, Inject, OnDestroy} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {ObSpinnerService} from '@oblique/oblique';
import {ObIDialogData} from '../dialog.model';

@Component({
	selector: 'sc-example-dialog',
	templateUrl: './example-dialog.component.html'
})
export class ExampleDialogComponent implements AfterViewInit, OnDestroy {
	sampleChannel = 'demo';
	private timer: NodeJS.Timeout;

	constructor(
		public dialogRef: MatDialogRef<ExampleDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ObIDialogData,
		private readonly spinner: ObSpinnerService
	) {
		if (data.spinner === 'global') {
			spinner.activate();
			this.timer = setTimeout(() => spinner.deactivate(), 2000);
		}
	}

	ngAfterViewInit(): void {
		if (this.data.spinner === 'dialog') {
			this.spinner.activate(this.sampleChannel);
			this.timer = setTimeout(() => this.spinner.deactivate(this.sampleChannel), 2000);
		}
	}

	ngOnDestroy(): void {
		const channel = this.data.spinner === 'dialog' ? this.sampleChannel : undefined;
		this.spinner.deactivate(channel);
		clearTimeout(this.timer);
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
