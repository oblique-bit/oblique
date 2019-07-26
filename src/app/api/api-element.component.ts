import {Component, Input} from '@angular/core';
import {APIelement} from './api.component';

@Component({
	selector: 'or-api-element',
	templateUrl: './api-element.component.html'
})
export class ApiElementComponent {
	@Input() elements: APIelement[];
}
