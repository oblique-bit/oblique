import {Component, computed, input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ObButtonDirective, ObExternalLinkDirective} from '@oblique/oblique';

@Component({
	selector: 'app-stackblitz-link',
	imports: [MatButton, ObButtonDirective, ObExternalLinkDirective],
	templateUrl: './stackblitz-link.component.html',
})
export class StackblitzLinkComponent {
	readonly project = input.required<string>();
	readonly file = input.required<string>();
	readonly href = computed(() => `${this.stackblitzUrl}/${this.project()}?file=${encodeURIComponent(this.file())}`);
	private readonly stackblitzUrl = 'https://stackblitz.com/github/oblique-bit/oblique-stackblitz/tree/master';
}
