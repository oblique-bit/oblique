import {Pipe, PipeTransform, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslateService} from '@ngx-translate/core';
import {map, startWith} from 'rxjs/operators';
import {OB_HAS_LANGUAGE_IN_URL} from '../utilities';
import type {ObLanguageSegmentRegex} from './router.model';

@Pipe({
	name: 'obLocalize',
	pure: false, // eslint-disable-line @angular-eslint/no-pipe-impure
})
export class ObLocalizePipe implements PipeTransform {
	/**
	 * RegExp construction is relatively expensive. To improve performances, they are cached as static variable so that
	 * they are created only once per language configuration and not once per instance or worse: once per call
	 */
	private static readonly languageSegmentRegex = {} as ObLanguageSegmentRegex;
	private static readonly routeSegmentSplitter = /(?<!^|\.)\//u;
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly hasLanguageInUrl = inject(OB_HAS_LANGUAGE_IN_URL);
	private readonly translate = inject(TranslateService);
	private readonly currentLang = toSignal(
		this.translate.onLangChange.pipe(
			map(evt => evt.lang),
			startWith(this.translate.getCurrentLang())
		)
	);

	transform(route: string | string[] | null | undefined): string | null | undefined {
		if (route === null || route === undefined) {
			return route as null | undefined;
		}
		const segments = Array.isArray(route) ? route : this.routeToSegments(route);
		const serializedRoute = this.router.serializeUrl(
			this.router.createUrlTree(segments.filter(Boolean), {relativeTo: this.route})
		);
		if (!this.hasLanguageInUrl) {
			return serializedRoute;
		}
		const {onlySlashWithLanguage, leadingSlashWithLanguage} = this.getRegExps(this.translate.getLangs());
		return onlySlashWithLanguage.test(serializedRoute)
			? `/${this.currentLang()}`
			: serializedRoute.replace(leadingSlashWithLanguage, `/${this.currentLang()}/`);
	}

	/**
	 * Converts a route string into the segment array format expected by the Angular router
	 * "path/to/somewhere" => ['path', 'to', 'somewhere']
	 * "/path/to/somewhere" => ['/path', 'to', 'somewhere']
	 * "./path/to/somewhere" => ['./path', 'to', 'somewhere']
	 * "../../path/to/somewhere" => ['../../path', 'to', 'somewhere']
	 * */
	private routeToSegments(route: string): string[] {
		return route.split(ObLocalizePipe.routeSegmentSplitter);
	}

	private getRegExps(languages: readonly string[]): ObLanguageSegmentRegex {
		const serializedLanguages = languages.join('|');
		// language list has changed, regexps need to be rebuilt
		if (ObLocalizePipe.languageSegmentRegex.serializedLanguages !== serializedLanguages) {
			ObLocalizePipe.languageSegmentRegex.serializedLanguages = serializedLanguages;

			// matches strictly "/" or "/en"
			ObLocalizePipe.languageSegmentRegex.onlySlashWithLanguage = new RegExp(`^\\/(?:${serializedLanguages})?$`);

			// matches:
			// "/" in "/path"
			// "/en" in "/en"
			// "/en" in "/en/path"
			// "/" in "/enough" (en is not matched)
			ObLocalizePipe.languageSegmentRegex.leadingSlashWithLanguage = new RegExp(
				`^\\/(?:(?:${serializedLanguages})(?=\\/|$)\\/?)?`
			);
		}
		return ObLocalizePipe.languageSegmentRegex;
	}
}
