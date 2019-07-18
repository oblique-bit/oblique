import {Component} from '@angular/core';
import {MasterLayoutService, MaterialService} from 'oblique';

@Component({
	selector: 'or-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent {
	material: boolean;

	constructor(masterLayout: MasterLayoutService, materialService: MaterialService) {
		this.material = materialService.enabled;
		materialService.toggled.subscribe(enabled => {
			this.material = enabled;
		});
	}
}
