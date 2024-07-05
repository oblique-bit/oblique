import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
	selector: 'ssr-root',
	standalone: true,
	imports: [RouterOutlet, RouterLink, MatButtonToggleGroup, MatButtonToggle, ReactiveFormsModule],
	templateUrl: './app.component.html',
	styleUrl: 'app.component.scss'
})
export class AppComponent {
	readonly language = new FormControl('en');
	private readonly translateService = inject(TranslateService);

	constructor() {
		this.translateService.addLangs(['en', 'fr']);
		this.translateService.use('en');
		this.language.valueChanges.pipe(takeUntilDestroyed()).subscribe(lang => this.translateService.use(lang as string));
	}
}
