import {ChangeDetectionStrategy, Component, ViewEncapsulation, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'ob-top-control',
	imports: [MatIconModule, TranslatePipe],
	templateUrl: './top-control.component.html',
	styleUrls: ['./top-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-top-control'},
})
export class ObTopControlComponent {
	readonly scrollToTop = output();

	public scrollTop(): void {
		this.scrollToTop.emit();
	}
}
