import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'ob-top-control',
	imports: [MatIconModule, TranslateModule],
	templateUrl: './top-control.component.html',
	styleUrls: ['./top-control.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-top-control'},
})
export class ObTopControlComponent {
	@Output() readonly scrollToTop = new EventEmitter<void>();

	public scrollTop(): void {
		this.scrollToTop.emit();
	}
}
