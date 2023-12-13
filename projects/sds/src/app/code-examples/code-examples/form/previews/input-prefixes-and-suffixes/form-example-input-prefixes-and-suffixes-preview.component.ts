import {FormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule, ObFormFieldModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-input-prefixes-and-suffixes-preview',
	templateUrl: './form-example-input-prefixes-and-suffixes-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', './form-example-input-prefixes-and-suffixes-preview.component.scss'],
	standalone: true,
	imports: [FormsModule, MatFormFieldModule, MatIconModule, MatInputModule, ObErrorMessagesModule, ObFormFieldModule]
})
export class FormExampleInputPrefixesAndSuffixesPreviewComponent {}
