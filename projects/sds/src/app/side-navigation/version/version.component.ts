import {ChangeDetectionStrategy, Component, Input, OnChanges, Output, SimpleChanges, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CmsDataService} from '../../cms/cms-data.service';
import {Version} from '../../cms/models/version.model';
import {Observable, filter, first, map, switchMap, tap} from 'rxjs';
import {IdPipe} from '../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {latest} from '../../../obliqueVersion';
import {VersionOption} from './version.model';
import {ObSelectDirective} from '@oblique/oblique';
import {URL_CONST} from '../../shared/url/url.const';

@Component({
	selector: 'app-version',
	templateUrl: './version.component.html',
	styleUrls: ['./version.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, IdPipe, MatFormField, MatSelect, MatOption, ObSelectDirective, MatLabel, MatTooltip]
})
export class VersionComponent implements OnChanges {
	@Input() idPrefix = '';
	@Input() isDisabled = false;
	@Output() readonly versionChanged: Observable<number>;

	readonly componentId = 'version';
	readonly selectedVersion = new FormControl<number | undefined>(undefined);
	readonly versions$: Observable<VersionOption[]>;
	private readonly cmsDataService = inject(CmsDataService);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly router = inject(Router);

	constructor() {
		this.versionChanged = this.selectedVersion.valueChanges;
		this.versions$ = this.setupVersions();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.isDisabled) {
			if (this.isDisabled) {
				this.selectedVersion.disable();
			} else {
				this.selectedVersion.enable();
			}
		}
	}

	private setupVersions(): Observable<VersionOption[]> {
		return this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			first(),
			switchMap(() => this.cmsDataService.getVersions()),
			map(versionCms => this.mapCmsData(versionCms.data)),
			tap(versions => this.selectedVersion.setValue(this.getVersion(versions)))
		);
	}

	private mapCmsData(versions: Version[]): VersionOption[] {
		return versions
			.map(version => version.version_number)
			.sort((v1, v2) => v2 - v1)
			.map((version, index) => ({
				number: version,
				label: index === 0 ? `${latest} (latest)` : `${version}`
			}));
	}

	private getVersion(versions: VersionOption[]): number {
		const currentSlug = this.activatedRoute.snapshot.children[0].paramMap.get(URL_CONST.urlParams.selectedSlug);
		const versionFromURL = /(?<=-)\d+$/.exec(currentSlug) ?? [];
		return parseInt(versionFromURL[0], 10) || this.getLatestVersion(versions);
	}

	private getLatestVersion(versions: VersionOption[]): number {
		return Math.max(...versions.map(version => version.number));
	}
}
