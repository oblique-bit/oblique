import {Component, ElementRef, ViewChild} from '@angular/core';
import {MaterialService} from 'oblique-reactive';

@Component({
	selector: 'or-styles',
	templateUrl: './styles.component.html',
	styles: [`
		h2:not(:first-child) {
			margin-top: 1rem;
		}

		.ml + .ml {
			margin-left: 1rem;
		}`]
})
export class StylesComponent {
	@ViewChild('filterControl', {static: false}) filterControl: ElementRef;
	material = false;

	constructor(private materialService: MaterialService) {
		this.material = this.materialService.enabled;
		this.materialService.toggled.subscribe(enabled => this.material = enabled);
	}
}
