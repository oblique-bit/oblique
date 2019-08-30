import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
	selector: 'or-description',
	templateUrl: './description.component.html'
})
export class DescriptionComponent implements OnInit {
	@Input() component: string;
	@Input() directory: string;
	description: SafeHtml;

	constructor(private readonly sanitizer: DomSanitizer) {
	}

	ngOnInit(): void {
		this.description = this.sanitizer.bypassSecurityTrustHtml(
			require(`!!raw-loader!../../../projects/oblique/src/lib/${this.directory || this.component}/${this.component}.description.html`)
		);
	}
}
