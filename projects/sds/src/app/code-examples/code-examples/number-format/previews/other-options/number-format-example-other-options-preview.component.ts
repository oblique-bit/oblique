import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {ObNumberFormatModule} from '@oblique/oblique';
import {Component} from '@angular/core';

@Component({
	selector: 'app-number-format-example-other-options-preview',
	templateUrl: './number-format-example-other-options-preview.component.html',
	standalone: true,
	imports: [FormsModule, MatFormFieldModule, MatInputModule, ObNumberFormatModule],
	styleUrls: ['../../../../code-example-flex-layout.scss']
})
export class NumberFormatExampleOtherOptionsPreviewComponent {
	example4decimals = 5.236548;
	examplePersistentChanges = 5.236548;
}
