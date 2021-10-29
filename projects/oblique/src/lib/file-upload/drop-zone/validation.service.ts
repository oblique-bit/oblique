import {Injectable} from '@angular/core';
import {ObNotificationService} from '../../notification/notification.service';
import {ObEMimeTypes, ObEWildCardMimeTypes, ObIFileValidation} from '../file-upload.model';
import {ObAcceptAllPipe} from './accept-all.pipe';

@Injectable()
export class ObValidationService {
	private readonly areAllTypesAllowed = new ObAcceptAllPipe().transform;

	constructor(private readonly notification: ObNotificationService) {}

	public filterInvalidFiles(files: File[], accept: string[] = ['*'], maxSize: number, multiple: boolean): File[] {
		const dispatchedFiles: ObIFileValidation = this.dispatchFiles(files, accept, maxSize, multiple);
		this.notifyErrors('i18n.oblique.file-upload.error.single', dispatchedFiles.overflowing);
		this.notifyErrors('i18n.oblique.file-upload.error.type', dispatchedFiles.invalid, accept.join(', '));
		this.notifyErrors('i18n.oblique.file-upload.error.size', dispatchedFiles.tooLarge, maxSize);

		return dispatchedFiles.valid;
	}

	private dispatchFiles(files: File[], accept: string[], maxSize: number, multiple: boolean): ObIFileValidation {
		return files.reduce(
			(result, file, index) => {
				const size = file.size / 1024 / 1024;
				if (index > 0 && !multiple) {
					result.overflowing.push(file.name);
				} else if (!this.isFileTypeValid(file.name.toLowerCase(), accept)) {
					result.invalid.push(file.name);
				} else if (size > maxSize) {
					result.tooLarge.push(`${file.name} (${size.toFixed(2)} MB)`);
				} else {
					result.valid.push(file);
				}
				return result;
			},
			{valid: [], overflowing: [], invalid: [], tooLarge: []}
		);
	}

	private notifyErrors(message: string, errors: string[], parameter?: any): void {
		if (errors.length) {
			const params = {errors: errors.join(', ')} as {errors: string; parameter: any};
			if (parameter) {
				params.parameter = parameter;
			}
			this.notification.error({message: message, messageParams: params, title: 'i18n.oblique.file-upload.error.title'});
		}
	}

	private isFileTypeValid(filename: string, accept: string[]): boolean {
		return this.areAllTypesAllowed(accept) || this.hasValidMimeType(filename, accept) || this.hasValidExtension(filename, accept);
	}

	private hasValidMimeType(filename: string, accept: string[]): boolean {
		return accept.filter(type => type.includes('/')).some(type => this.isMimeTypeValid(filename, type.trim()));
	}

	private hasValidExtension(filename: string, accept: string[]): boolean {
		return accept.filter(type => !type.includes('/')).some(type => this.isExtensionValid(filename, type.trim()));
	}

	private isMimeTypeValid(filename: string, allowedFileType: string): boolean {
		const fileExtension = filename.split('.')[1];
		return allowedFileType.endsWith('*')
			? ObEWildCardMimeTypes[allowedFileType]?.includes(fileExtension)
			: ObEMimeTypes[allowedFileType]?.includes(fileExtension);
	}

	private isExtensionValid(filename: string, allowedFileType: string): boolean {
		return allowedFileType === `.${filename.split('.').pop()}`;
	}
}
