import {Component} from '@angular/core';
import {ObSpinnerModule} from '@oblique/oblique';
import {RouterOutlet} from '@angular/router';
import {SideNavigationComponent} from './side-navigation/side-navigation.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [RouterOutlet, ObSpinnerModule, SideNavigationComponent]
})
export class AppComponent {}
