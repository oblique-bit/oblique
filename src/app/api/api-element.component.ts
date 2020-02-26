import {Component, Input} from '@angular/core';
import {ObIAPIelement} from './api.component';

@Component({
	selector: 'ob-api-element',
	templateUrl: './api-element.component.html'
})
export class ObApiElementComponent {
	@Input() elements: ObIAPIelement[];
}
