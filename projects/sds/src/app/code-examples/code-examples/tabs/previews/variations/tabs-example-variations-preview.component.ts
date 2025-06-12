import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {ObIconModule} from '@oblique/oblique';

@Component({
	selector: 'app-tabs-example-variations-preview',
	templateUrl: './tabs-example-variations-preview.component.html',
	styleUrl: './tabs-example-variations-preview.component.scss',
	imports: [MatTabsModule, MatIconModule, ObIconModule]
})
export class TabsExampleVariationsPreviewComponent {}
