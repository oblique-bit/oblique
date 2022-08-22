import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
	selector: 'sc-description',
	templateUrl: './description.component.html'
})
export class DescriptionComponent implements OnInit {
	@Input() component: string;
	description: SafeHtml;

	constructor(private readonly sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		if (this.component) {
			this.description = this.sanitizer.bypassSecurityTrustHtml(
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				require(`!!raw-loader!../../../projects/oblique/src/lib/${this.component}/${this.component}.description.html`).default
			);
		}
	}
}
