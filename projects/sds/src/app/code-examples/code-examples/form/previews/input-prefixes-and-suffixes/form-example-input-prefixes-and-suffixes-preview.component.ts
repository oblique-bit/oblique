import {FormsModule} from '@angular/forms';
import {AfterViewInit, ChangeDetectorRef, Component, inject} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-input-prefixes-and-suffixes-preview',
	templateUrl: './form-example-input-prefixes-and-suffixes-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', './form-example-input-prefixes-and-suffixes-preview.component.scss'],
	imports: [FormsModule, MatFormFieldModule, MatIconModule, MatInputModule, ObErrorMessagesModule]
})
export class FormExampleInputPrefixesAndSuffixesPreviewComponent implements AfterViewInit {
	/* The whole content of this class is simply a workaround for https://github.com/angular/components/issues/26428. This is an Angular bug
	 * that prevents input prefix from being used in a Tab. */
	show = false;
	private readonly cdf = inject(ChangeDetectorRef);

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.show = true;
			this.cdf.markForCheck();
		}, 100);
	}
}
