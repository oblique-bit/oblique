import {Component} from '@angular/core';
import {Unsubscribable} from '../unsubscribe';
import 'rxjs/add/operator/takeUntil';
import {SpinnerService} from './spinner.service';

@Component({
	selector: 'or-spinner',
	template: `<div [hidden]="!spinnerActive" class="overlay overlay-inverse overlay-fixed">
                    <div class="spinner-viewport">
                        <span class="spinner fa fa-spinner fa-4x"></span>
                    </div>
                </div>`
})
export class SpinnerComponent extends Unsubscribable {
	public spinnerActive = false;

	constructor(private spinnerService: SpinnerService) {
		super();
		spinnerService.onSpinnerStatusChange.takeUntil(this.unsubscribe).subscribe((status: boolean) => {
			this.spinnerActive = status;
		});
	}
}
