import {AfterViewInit, Component, OnDestroy, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {ObButtonModule, ObSpinnerModule, ObSpinnerService} from '@oblique/oblique';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
	standalone: true,
	imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ObButtonModule, ObSpinnerModule],
	selector: 'sb-example-dialog-spinner',
	templateUrl: './example-dialog-spinner.component.html'
})
export class ExampleDialogSpinnerComponent implements AfterViewInit, OnDestroy {
	readonly sampleChannel = 'demo';
	private timer: ReturnType<typeof setTimeout>;
	private readonly spinner = inject(ObSpinnerService);

	ngAfterViewInit(): void {
		this.spinner.activate(this.sampleChannel);
		this.timer = setTimeout(() => this.spinner.deactivate(this.sampleChannel), 2000);
	}

	ngOnDestroy(): void {
		this.spinner.deactivate(this.sampleChannel);
		clearTimeout(this.timer);
	}
}
