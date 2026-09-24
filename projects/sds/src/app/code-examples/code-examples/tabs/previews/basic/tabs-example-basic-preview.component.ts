import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'app-tabs-example-basic-preview',
	imports: [MatTabsModule, MatIconModule],
	templateUrl: './tabs-example-basic-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TabsExampleBasicPreviewComponent {}
