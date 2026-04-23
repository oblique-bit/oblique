import {Component, DOCUMENT, type OnInit, Renderer2, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {TranslateModule} from '@ngx-translate/core';
@Component({
	selector: 'ssr-mode-selectors',
	imports: [ReactiveFormsModule, MatButtonToggleModule, TranslateModule],
	templateUrl: './mode-selectors.component.html',
	styleUrl: 'mode-selectors.component.scss',
})
export class ModeSelectorComponent implements OnInit {
	readonly formBuilder = inject(NonNullableFormBuilder);
	readonly form = this.formBuilder.group({
		lightnessDark: '',
		componentSize: '',
		density: '',
		typographyContextProse: '',
		motionDisabled: '',
	});
	private readonly renderer = inject(Renderer2);
	private readonly document = inject(DOCUMENT);

	constructor() {
		this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.toggleBodyStyles());
	}

	ngOnInit(): void {
		this.checkLightness();
	}

	private toggleBodyStyles(): void {
		const selectedStyles: string[] = this.getSelectedStyles();
		Array.from(this.document.body.classList).forEach(style => {
			if (style.startsWith('ob-') && !selectedStyles.includes(style)) {
				this.renderer.removeClass(this.document.body, style);
			}
		});
		selectedStyles.forEach(style => {
			this.renderer.addClass(this.document.body, style);
		});
	}

	private checkLightness(): void {
		if (this.document?.defaultView?.matchMedia) {
			if (this.document.defaultView.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.form.controls.lightnessDark.setValue('ob-lightness-dark');
			}
		}
	}

	private getSelectedStyles(): string[] {
		return Object.values(this.form.getRawValue()).filter(value => value.length > 0);
	}
}
