import {Component, EventEmitter, Inject, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {WINDOW} from '../../utilities';
import {ObPopUpService} from '../../pop-up/pop-up.service';
import {ObEUploadEventType, ObIFile, ObIFileList, ObIUploadEvent} from '../file-upload.model';
import {ObFileUploadService} from '../file-upload.service';

@Component({
	selector: 'ob-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-progress'}
})
export class ObProgressComponent implements OnDestroy {
	@Output() uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() singleRequest: boolean;
	@Input() uploadUrl: string;
	uploadedFiles: ObIFileList = {} as ObIFileList;
	private readonly window: Window;

	constructor(
		private readonly fileUploadService: ObFileUploadService,
		private readonly popup: ObPopUpService,
		private readonly translate: TranslateService,
		@Inject(WINDOW) window: any
	) {
		this.window = window;
	}

	@Input() set files(files: File[]) {
		// let some time for the other inputs to be processed
		this.window.setTimeout(() => this.uploadFiles(files));
	}

	ngOnDestroy(): void {
		this.uploadedFiles.files?.forEach(file => file.subscription.unsubscribe());
	}

	cancelUpload(file: ObIFile): void {
		if (!file.completed && this.popup.confirm(this.translate.instant('i18n.oblique.file-upload.remove'))) {
			this.uploadedFiles.files[file.index]?.subscription.unsubscribe();
			this.uploadedFiles.files.splice(file.index, 1);
			this.uploadedFiles.fileCount--;
			this.uploadEvent.emit({type: ObEUploadEventType.CANCELED, files: this.arrayifyFiles(file.binary)});
			this.isUploadComplete();
		}
	}

	retryUpload(file: ObIFile): void {
		if (file.hasError) {
			if (this.singleRequest) {
				this.uploadFilesTogether(file.binary as File[]);
			} else {
				this.uploadSingleFile(this.convertToObIFile(file.binary, file.index));
			}
		}
	}

	private uploadFiles(files: File[]): void {
		this.uploadedFiles.fileCount = files.length;
		if (this.singleRequest) {
			this.uploadFilesTogether(files);
		} else {
			this.uploadFilesIndividually(files);
		}
	}

	private uploadFilesIndividually(files: File[]): void {
		this.uploadedFiles.files = files.map((file, index) => this.convertToObIFile(file, index));
		this.uploadedFiles.files.forEach(file => this.uploadSingleFile(file));
	}

	private uploadSingleFile(file: ObIFile): void {
		this.uploadedFiles.files[file.index].subscription = this.fileUploadService.upload(this.uploadUrl, file.binary as File).subscribe(event => {
			this.updateFileProgress(event, file.index);
		});
	}

	private isUploadComplete(): void {
		if (!this.uploadedFiles.files.some(file => !file.completed)) {
			const completedFiles = this.uploadedFiles.files.reduce((files, file) => [...files, ...this.arrayifyFiles(file.binary)], [] as File[]);
			this.uploadEvent.emit({type: ObEUploadEventType.UPLOADED, files: completedFiles});
			this.fileUploadService.notifyUploadComplete();
			// delay the reset to let users see what is happening
			this.window.setTimeout(() => {
				this.uploadedFiles.fileCount = 0;
				this.uploadedFiles.files.length = 0;
			}, 1000);
		}
	}

	private uploadFilesTogether(files: File[]): void {
		this.uploadedFiles.files = [this.convertToObIFile(files, 0)];
		this.uploadedFiles.files[0].subscription = this.fileUploadService.multiUpload(this.uploadUrl, files).subscribe(event => {
			this.updateFileProgress(event, 0);
		});
	}

	private updateFileProgress(event: HttpEvent<HttpEventType.UploadProgress | HttpEventType.Response | HttpEventType.User>, index: number): void {
		if (event.type !== HttpEventType.User) {
			this.uploadedFiles.files[index].progress = event.type === HttpEventType.UploadProgress ? Math.round((event.loaded / event.total) * 100) : 100;
		} else {
			this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: (event as {type: HttpEventType; files: File[]}).files});
		}
		this.uploadedFiles.files[index].completed = event.type === HttpEventType.Response;
		this.uploadedFiles.files[index].hasError = event.type === HttpEventType.User;
		this.isUploadComplete();
	}

	private convertToObIFile(file: File | File[], index: number): ObIFile {
		return {
			index,
			name: (file as File).name,
			completed: false,
			progress: 0,
			hasError: false,
			binary: file,
			subscription: undefined
		};
	}

	private arrayifyFiles(binary: File | File[]): File[] {
		return binary instanceof Array ? binary : [binary];
	}
}
