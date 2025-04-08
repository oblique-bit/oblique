import {Directive, HostListener, OnInit, inject} from '@angular/core';
import {CollectorService} from '../shared/collector/collector.service';
import {FeedbackFormComponent} from './feedback-form/feedback-form.component';

@Directive({
	selector: '[appFeedbackTrigger]',
	providers: [CollectorService]
})
export class FeedbackTriggerDirective implements OnInit {
	private readonly collectorService = inject(CollectorService);

	ngOnInit(): void {
		this.collectorService.initializeCollector('6dfd32b3');
		// eslint-disable-next-line @typescript-eslint/naming-convention,camelcase
		this.collectorService.defaultValues = {customfield_12505: () => window.location.href};
		this.collectorService.fallbackDialog = FeedbackFormComponent;
	}

	@HostListener('click')
	collectFeedback(): void {
		this.collectorService.collect();
	}
}
