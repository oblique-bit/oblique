import {Component, Input, OnChanges} from '@angular/core';
import {ObIAPIelement} from './api.component';

@Component({
	selector: 'ob-api-element',
	templateUrl: './api-element.component.html'
})
export class ObApiElementComponent implements OnChanges {
	@Input() elements: ObIAPIelement[];

	ngOnChanges() {
		this.elements.forEach(element => {
			if (!element.default) {
				element.default = '<i>empty string</i>';
			} else if (!this.hasHtmlContent(element.default)) {
				element.default = `<code>${element.default}</code>`;
			}
		});
	}

	private hasHtmlContent(content: any): boolean {
		return typeof content === 'string' && /<[^>]*>/g.test(content);
	}
}
