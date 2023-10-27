import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {ObIconModule} from '@oblique/oblique';

@Component({
	selector: 'app-tabs-example-basic-preview',
	templateUrl: './tabs-example-basic-preview.component.html',
	standalone: true,
	imports: [MatTabsModule, MatIconModule, ObIconModule]
})
export class TabsExampleBasicPreviewComponent {}
