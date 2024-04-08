import {ChangeDetectionStrategy, Component, Input, OnInit, Output, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatTooltip} from '@angular/material/tooltip';
import {CmsDataService} from '../../cms/cms-data.service';
import {Version} from '../../cms/models/version.model';
import {Observable, map, tap} from 'rxjs';
import {IdPipe} from '../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {ObSelectDirective} from '@oblique/oblique';

@Component({
	selector: 'app-version',
	templateUrl: './version.component.html',
	styleUrls: ['./version.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, IdPipe, MatFormField, MatSelect, MatOption, ObSelectDirective, MatLabel, MatTooltip]
})
export class VersionComponent implements OnInit {
	@Input() idPrefix = '';
	@Output() readonly versionChanged: Observable<number>;

	readonly componentId = 'version';
	selectedVersion = new FormControl<number | undefined>(undefined);
	versions$: Observable<number[]>;
	private readonly cmsDataService = inject(CmsDataService);

	constructor() {
		this.versionChanged = this.selectedVersion.valueChanges;
	}

	ngOnInit(): void {
		this.versions$ = this.setupVersions();
	}

	private setupVersions(): Observable<number[]> {
		return this.cmsDataService.getVersions().pipe(
			map(versionCms => this.mapCmsData(versionCms.data)),
			tap(versions => this.selectedVersion.setValue(this.getLatestVersion(versions)))
		);
	}

	private mapCmsData(versions: Version[]): number[] {
		return versions.map(version => version.version_number).sort((v1, v2) => v2 - v1);
	}

	private getLatestVersion(versions: number[]): number {
		return Math.max(...versions);
	}
}
