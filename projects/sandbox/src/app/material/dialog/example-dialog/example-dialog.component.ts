import {AfterViewInit, Component, OnDestroy, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ObSpinnerService} from '@oblique/oblique';
import {ObIDialogData} from '../dialog.model';

@Component({
	selector: 'sb-example-dialog',
	templateUrl: './example-dialog.component.html',
	standalone: false
})
export class ExampleDialogComponent implements AfterViewInit, OnDestroy {
	sampleChannel = 'demo';
	dialogRef = inject<MatDialogRef<ExampleDialogComponent>>(MatDialogRef);
	data = inject<ObIDialogData>(MAT_DIALOG_DATA);
	private readonly spinner = inject(ObSpinnerService);
	private timer: NodeJS.Timeout;

	constructor() {
		if (this.data.spinner === 'global') {
			this.spinner.activate();
			this.timer = setTimeout(() => this.spinner.deactivate(), 2000);
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
