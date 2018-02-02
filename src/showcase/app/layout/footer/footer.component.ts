import {Component} from '@angular/core';

@Component({
	selector: 'layout-footer',
	templateUrl: './footer.component.html',
	styles: [`
		@media (min-width: 992px) {
			:host {
				display: flex;
				width: 100%;
			}
		}
	`]
})
export class LayoutFooterComponent {

}
