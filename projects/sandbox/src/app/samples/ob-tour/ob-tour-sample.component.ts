import {Component, type OnInit, inject} from '@angular/core';
import {ObTourComponent, ObTourService, type ObToursConfig} from '@oblique/ob-tour';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'sb-ob-tour',
	imports: [ObTourComponent, MatButtonModule, MatFormFieldModule, MatSelectModule, MatListModule, MatSlideToggleModule],
	templateUrl: './ob-tour-sample.component.html',
	styleUrl: './ob-tour-sample.component.scss'
})
export class ObTourSampleComponent implements OnInit {
	tourConfig: ObToursConfig = {
		tours: [
			{
				tourTitle: 'Hello Test',
				tourDescription: 'description for testing of the tour config',
				steps: [
					{
						stepTitle: 'first Step of the tour',
						stepDescription: 'description of the first tour step'
					},
					{
						stepTitle: 'second step of the tour',
						stepDescription: 'description of the second tour step'
					}
				],
				storageKey: 'tourStorageKey',
				triggers: [{type: 'manual'}]
			}
		]
	};

	tourService = inject(ObTourService);
	tourConfigString = '';

	ngOnInit(): void {
		this.tourService.init(this.tourConfig);
		this.tourConfigString = JSON.stringify(this.tourService.getConfig());
	}
}
