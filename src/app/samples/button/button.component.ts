import {Component} from '@angular/core';
import {MasterLayoutService, MaterialService} from 'oblique-reactive';

@Component({
	selector: 'or-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
	material: boolean;

	constructor(masterLayout: MasterLayoutService, materialService: MaterialService) {
		this.material = materialService.enabled;
		materialService.toggled.subscribe(enabled => {
			this.material = enabled;
		});
	}
}
