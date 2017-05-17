import {Component, ContentChild, Input, AfterViewInit, HostListener, ElementRef} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'or-date-picker',
	template: `
        <div class="input-group">
            <ng-content></ng-content>
            <button type="button" class="input-group-addon" [disabled]="disabled" (click)="ngbDatePicker.toggle()" >
                <span class="fa fa-calendar"></span>
            </button>
        </div>`,
})
export class DatepickerComponent implements AfterViewInit {
	@ContentChild(NgbInputDatepicker) ngbDatePicker: NgbInputDatepicker;

	private _disabled = false;

	@Input()
	set disabled(val) {
		this._disabled = val;
		if (this.ngbDatePicker) {
			this.ngbDatePicker.setDisabledState(val);
			this.ngbDatePicker.close();
		}
	}

	get disabled() {
		return this._disabled;
	}

	constructor(private element: ElementRef) {
	}

	//TODO: only apply this listener if the popup is open and remove it as soon as it's closed
	@HostListener('document:click', ['$event.target'])
	onDocumentClick(target: HTMLElement) {
		if (this.ngbDatePicker.isOpen()) {
			let parentFound = false;
			while (target != null && !parentFound) {
				if (target === this.element.nativeElement) {
					parentFound = true;
				}
				target = target.parentElement;
			}
			if (!parentFound) {
				this.ngbDatePicker.close();
			}
		}
	}

	ngAfterViewInit() {
		if (!this.ngbDatePicker) {
			throw new Error('or-date-picker requires a transcluded ngbDatepicker');
		}
		this.ngbDatePicker.setDisabledState(this._disabled);
	}
}
