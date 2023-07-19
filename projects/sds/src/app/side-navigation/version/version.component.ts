import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CmsDataService} from '../../cms/cms-data.service';
import {Version} from '../../cms/models/version.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {IdPipe} from '../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-version',
	templateUrl: './version.component.html',
	styleUrls: ['./version.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, IdPipe]
})
export class VersionComponent implements OnDestroy, OnInit {
	@Input() idPrefix = '';
	@Output() readonly versionChanged: EventEmitter<number> = new EventEmitter<number>();

	readonly componentId = 'version';
	selectedVersion = new FormControl<number | undefined>(undefined);

	versions$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

	private readonly subscriptions: Subscription[] = [];

	constructor(private readonly cmsDataService: CmsDataService) {}

	ngOnInit(): void {
		this.handleSelectedVersionChanged();
		this.setupVersions();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	private handleSelectedVersionChanged(): void {
		this.subscriptions.push(this.selectedVersion.valueChanges.subscribe(version => this.versionChanged.emit(version ?? undefined)));
	}

	private setupVersions(): void {
		this.subscriptions.push(
			this.cmsDataService.getVersions().subscribe(versionCms => {
				const versions: number[] = this.mapCmsData(versionCms.data);

				this.versions$.next(versions);
				this.selectedVersion.setValue(this.getLatestVersion(versions));
			})
		);
	}

	private mapCmsData(versions: Version[]): number[] {
		return versions.map(version => version.version_number).sort((v1, v2) => v2 - v1);
	}

	private getLatestVersion(versions: number[]): number {
		return Math.max(...versions);
	}
}
