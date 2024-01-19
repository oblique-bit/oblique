import {Component, OnInit, inject} from '@angular/core';
import {CollectorService} from '../../shared/collector/collector.service';

@Component({
	selector: 'feedback-button',
	standalone: true,
	providers: [CollectorService],
	templateUrl: './feedback-button.component.html',
	styleUrls: ['./feedback-button.component.scss']
})
export class FeedbackButtonComponent implements OnInit {
	private readonly collectorService = inject(CollectorService);

	ngOnInit(): void {
		this.collectorService.initializeCollector('6dfd32b3');
	}

	collectFeedback(): void {
		this.collectorService.collect();
	}
}
