import {Component, OnInit, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ObButtonDirective} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {CollectorService} from '../../shared/collector/collector.service';
import {FeedbackFormComponent} from '../feedback-form/feedback-form.component';

@Component({
	selector: 'feedback-button',
	standalone: true,
	providers: [CollectorService],
	imports: [MatButtonModule, ObButtonDirective, NgOptimizedImage],
	templateUrl: './feedback-button.component.html',
	styleUrls: ['./feedback-button.component.scss']
})
export class FeedbackButtonComponent implements OnInit {
	private readonly collectorService = inject(CollectorService);

	ngOnInit(): void {
		this.collectorService.initializeCollector('6dfd32b3');
		// eslint-disable-next-line @typescript-eslint/naming-convention,camelcase
		this.collectorService.defaultValues = {customfield_12505: () => window.location.href};
		this.collectorService.fallbackDialog = FeedbackFormComponent;
	}

	collectFeedback(): void {
		this.collectorService.collect();
	}
}
