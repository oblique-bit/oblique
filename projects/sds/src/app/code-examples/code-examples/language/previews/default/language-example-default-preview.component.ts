import {ObButtonModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StackblitzLinkComponent} from '../../../../../shared/stackblitz-link/stackblitz-link.component';

@Component({
	selector: 'app-language-example-default-preview',
	imports: [MatButtonModule, ObButtonModule, StackblitzLinkComponent],
	templateUrl: './language-example-default-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class LanguageExampleDefaultPreviewComponent {}
