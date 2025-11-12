import {Directive, ElementRef, Signal, effect, inject, input} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Directive({
	selector: '[obEllipsisTooltip]',
})
export class ObEllipsisTooltipDirective {
	obEllipsisTooltip = input('');
	private readonly hostElement: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly tooltip: MatTooltip = inject(MatTooltip);
	private readonly globalEvents: ObGlobalEventsService = inject(ObGlobalEventsService);

	constructor() {
		const resize: Signal<UIEvent> = toSignal(this.globalEvents.resize$);
		effect(() => {
			resize();
			this.obEllipsisTooltip();
			this.updateTooltipState();
		});
	}

	private updateTooltipState(): void {
		const element = this.hostElement.nativeElement;
		const isEllipsed = element.offsetWidth < element.scrollWidth;
		this.tooltip.disabled = !isEllipsed;
	}
}
