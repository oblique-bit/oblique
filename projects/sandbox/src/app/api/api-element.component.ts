import {Component, Input, OnChanges} from '@angular/core';
import {ObIAPIelement} from './api.model';

@Component({
	selector: 'sb-api-element',
	templateUrl: './api-element.component.html'
})
export class ApiElementComponent implements OnChanges {
	@Input() elements: ObIAPIelement[];

	ngOnChanges(): void {
		this.elements.forEach(element => {
			if (!element.default) {
				element.default = '<i>empty string</i>';
			} else if (!this.hasHtmlContent(element.default)) {
				element.default = `<code>${element.default}</code>`;
			}
		});
	}

	private hasHtmlContent(content: string | boolean | number): boolean {
		return typeof content === 'string' && /<[^>]*>/g.test(content);
	}
}
